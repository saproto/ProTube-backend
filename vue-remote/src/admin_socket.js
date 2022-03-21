const io = window.io = require('socket.io-client');
var socket;
import { eventBus } from '@/eventbus.js';

export { connectAdminSocket };

function connectAdminSocket(){
    const serverUrl = process.env.VUE_APP_ADMIN_SOCKET_ADDRESS;
    socket = new io(serverUrl, {
        timeout: 5*1000,
        forceNew: false,
        withCredentials: true,
        reconnection: true,
        autoConnect: true
    });

    socket.on("disconnect", (reason) => {
        console.log("disconnected socket: " + reason);
    });

    // connection errors
    socket.on("connect_error", (err) => {
        let error = "Unable to connect to ProTube";
        if (err == "Error: Not authorized") {
            error = "Unauthorized!";
        } else if(err == "Error: Unable to validate"){
            error = "Login error!";
        }
        eventBus.emit('admin-socket-connect-error', {
            reason: error
        });
    });

    socket.on('connect', () => {
        eventBus.emit('admin-socket-connect-success');
    });

    socket.on('admin-newscreencode', (screencode) => {
        eventBus.emit('admin-socket-screencode-update', screencode);
    });

    // there was a change in the queue, update this on the admin remote
    socket.on('admin-queue-update', (queue) => {
        eventBus.emit('admin-socket-queue-update', queue);
    });

    // the volume on the screens was changed
    socket.on('admin-new-volume', (volume) => {
        eventBus.emit('admin-new-volume', volume);
    });
}

export { getScreenCode }
async function getScreenCode(){
    console.log("requested screencode");
    return await new Promise( resolve => {
        socket.emit('get_screen_code', code => {
            resolve(code);
        });
    });
}

export { getUserData }
async function getUserData(){
    return await new Promise( resolve => {
        socket.emit('get-user-data', (userdata) => {
            resolve(userdata);
        });
    });
}

export { getVideoQueue }
async function getVideoQueue(){
    return await new Promise( resolve => {
        socket.emit('get-video-queue', (queue) => {
            resolve(queue);
        });
    });
}

export { regenScreenCode }
function regenScreenCode(){
    socket.emit('create-new-screen-code');
}

export { skipNextInQueue }
async function skipNextInQueue(){
    return await new Promise( resolve => {
        socket.emit('skip-next-in-queue', (success) => {
            resolve(success);
        });
    });
}

export { setRadio }
async function setRadio(radiostation){
    return await new Promise( resolve => {
        socket.emit('set-radio', radiostation, callback => {
            resolve(callback);
        });
    });
}

export { resumeProTube }
async function resumeProTube(){
    return await new Promise( resolve => {
        socket.emit('resume-protube', callback => {
            resolve(callback);
        });
    });
}

export { volumeChange }
async function volumeChange(volume){
    return await new Promise( resolve => {
        socket.emit('volume-change', volume, callback => {
            resolve(callback);
        });
    });
}