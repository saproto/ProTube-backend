const io = window.io = require('socket.io-client');
var socket;
let silentConnect = false;
import { eventBus } from '@/js/eventbus';

export { initializeSocket };

function resetSocket(pincode){
    const serverUrl = process.env.VUE_APP_SOCKET_ADDRESS;
    socket = new io(serverUrl, {
        auth: {
            token: pincode //socket handshake token
        },
        timeout: 5*1000,
        forceNew: false,
        withCredentials: true,
        reconnection: false,
        autoConnect: false,
    });
    connectSocket(socket);
    // if(pincode || localSessionID){
    //     connectSocket(socket);
    // } else{
    //     silentConnect = false;
    // }
    return;
}

function connectSocket(_socket){
    console.log("connecting...");
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
        _socket.emit('addVideoToQueue', video, callback => {
            eventBus.emit('addVideoToQueue-callback', {
                result: callback.success,
                message: callback.error,
                videoId: video.videoId
            });
        });
    });

    eventBus.on('remote-kill-sockets', () => {
        _socket.disconnect();
    });

    _socket.on("disconnect", (reason) => {
        console.log(reason);
        // if(reason == "io server disconnect") {
        //     localStorage.removeItem('sessionID');
        // }
        socket.disconnect();
        socket.removeAllListeners();
        eventBus.emit('toggleLoginModalVisible', true);
    });

    _socket.on("connect_error", (err) => {
        if(!silentConnect){
            if (err == "Error: Not authorized") {
                eventBus.emit('pinEntered-callback', {
                    success: false,
                    reason: "Unable to authorize with proto"
                });
            } else if (err == "Error: Invalid screencode") {
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

// Executed once on mounted of remote
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
