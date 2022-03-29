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
    return;
}

function connectSocket(){
    socket.connect();

    socket.on("disconnect", () => {
        socket.disconnect();
        socket.removeAllListeners();
        eventBus.emit('to-remote-from-remotesocket-toggle-loginmodal-visibility', true);
    });

    socket.on("connect_error", (err) => {
        if(!silentConnect){
            let reason = "Unknown error";
            if (err == "Error: Not authorized") {
                reason = "Unable to authorize with proto"
            } else if (err == "Error: Invalid screencode") {
                reason = "PIN invalid";
            }
            eventBus.emit('to-pincode-from-remotesocket-connect-error', {
                success: false,
                reason: reason
            });
        } else{
            silentConnect = false;
        }
    });

    socket.on('connect', () => {
        eventBus.emit('to-pincode-from-remotesocket-connect-success', {
            success: true,
            reason: ""
        });
        setTimeout(function(){ 
            eventBus.emit('to-remote-from-remotesocket-toggle-loginmodal-visibility', false); 
        }, 1000);
    });
}

// pincode entered, try to setup a connection
export { pinEntered }
function pinEntered(pincode){
    silentConnect = false;
    resetSocket(pincode);
}


// fetching videos
export { fetchVideosSocket }
async function fetchVideosSocket(search_string){
    return await new Promise( resolve => {
        socket.emit('retrieveVideos', search_string, callback => {
            resolve(callback);
        });
    });
}

// trying to add a video to the queue
export { addVideoToQueueSocket }
async function addVideoToQueueSocket(video){
    return await new Promise( resolve => {
        socket.emit('addVideoToQueue', video, callback => {
            resolve({
                result: callback.success,
                message: callback.error,
                videoId: video.videoId
            });
        });
    });
}

// exiting the page, kill the socket
export { killSocket }
function killSocket(){
    socket.disconnect();
}

// Executed once on mounted of remote
function initializeSocket(){
    resetSocket();
    silentConnect = true;
}
