import { eventBus } from '@/js/eventbus';
const io = window.io = require('socket.io-client');

let socket;
let silentConnect = false;


export function resetSocket(pincode){
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
    connectSocket();
    return;
}

function connectSocket(){
    socket.connect();

    socket.on("disconnect", () => {
        socket.disconnect();
        socket.removeAllListeners();
        eventBus.emit('remotesocket-disconnect');
    });

    socket.on("connect_error", (err) => {
        if(!silentConnect){
            let reason = "Unknown error";
            if (err == "Error: Not authorized") {
                reason = "Unable to authorize with proto"
            } else if (err == "Error: Invalid screencode") {
                reason = "PIN invalid";
            }
            eventBus.emit('remotesocket-connect-error', reason);
        } else{
            silentConnect = false;
        }
    });

    socket.on('connect', () => {
        eventBus.emit('remotesocket-connect-success', socket);
    });
}

// pincode entered, try to setup a connection
export function pinEntered(pincode){
    silentConnect = false;
    resetSocket(pincode);
}


// fetch YouTube videos from server
export function fetchVideosSocket(query) {
    return new Promise(resolve => {
        socket.emit('fetch-videos', query, result => {
            resolve(result);
        });
    });
}

export function fetchThenAddVideoSocket(videoId) {
    return new Promise(resolve => {
        socket.emit('fetch-then-add-video', videoId, result => {
            resolve(result);
        });
    });
}

export function fetchThenAddPlaylistSocket(playlistId) {
    return new Promise(resolve => {
        socket.emit('fetch-then-add-playlist', playlistId, result => {
            resolve(result);
        });
    });
}

// trying to add a video to the queue
export { addVideoToQueueSocket }
async function addVideoToQueueSocket(video){
    return await new Promise( resolve => {
        socket.emit('add-video-to-queue', video, callback => {
            resolve({
                result: callback.success,
                message: callback.error,
                videoId: video.videoId
            });
        });
    });
}

// // exiting the page, kill the socket
// export function killSocket(){
//     socket.disconnect();
// }

// Executed once on mounted of remote
export function initializeSocket(){
    resetSocket();
    silentConnect = true;
}
