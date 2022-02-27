const io = window.io = require('socket.io-client');
var socket;
let silentConnect = false;
import { eventBus } from './eventbus';

export { initializeSocket };

function resetSocket(pincode){
    const serverUrl = process.env.VUE_APP_SOCKET_ADDRESS;
    let localSessionID = localStorage.getItem("sessionID");
    socket = new io(serverUrl, {
        auth: {
            token: pincode, //socket handshake token
            sessionID: localSessionID
        },
        timeout: 1*1000,
        forceNew: true,
        reconnection: false,
        autoConnect: false,
    });
    if(pincode || localSessionID){
        connectSocket(socket);
    } else{
        silentConnect = false;
    }
    return;
}

function connectSocket(_socket){
    _socket.connect();

    eventBus.on('fetchVideos', (search_string) => {
        if(search_string == '') return false;
        _socket.emit("retrieveVideos", search_string, (response) => {
            if(!response) return;
            eventBus.emit('displayVideos', response);
        });
    });

    eventBus.on('addVideoToQueue', (video) =>{
        if(video == '' ) return false;
        _socket.emit('addVideoToQueue', video, success => {
            if(success) {
                var callbackMessage = "Added successfully";
            }else{
                callbackMessage = "Video already at playlist!";
            }
            eventBus.emit('addVideoToQueue-callback', {
                result: success,
                message: callbackMessage,
                videoId: video.videoId
            });
        });
    });

    _socket.on("session", sessionID => {
        localStorage.setItem("sessionID", sessionID);

    });

    _socket.on("disconnect", (reason) => {
        console.log(reason);
        if(reason == "io server disconnect") {
            localStorage.removeItem('sessionID');
        }
        socket.disconnect();
        socket.removeAllListeners();
        eventBus.emit('toggleLoginModalVisible', true);
    });

    _socket.on("connect_error", (err) => {
        if(!silentConnect){
            if (err == "Error: Not authorized") {
                eventBus.emit('pinEntered-callback', {
                    success: false,
                    reason: "PIN invalid"
                });
            } else {
                eventBus.emit('pinEntered-callback', {
                    success: false,
                    reason: "Unknown error"
                });
            }
        } else{
            silentConnect = false;
        }
    });

    _socket.on('connect', () => {
        eventBus.emit('pinEntered-callback', {
            success: true,
            reason: ""
        });
        setTimeout(function(){ eventBus.emit('toggleLoginModalVisible', false) }, 1000);
    });
}

function initializeSocket(){
    resetSocket();
    silentConnect = true;
}

eventBus.on('pinEntered', (pincode) =>{
    if(pincode != ''){
        silentConnect = false;
        resetSocket(pincode);
    }
});
