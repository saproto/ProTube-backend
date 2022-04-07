const io = window.io = require('socket.io-client');
export let socket;
import { eventBus } from '@/js/eventbus.js';

export function connectAdminSocket(){
    const serverUrl = process.env.VUE_APP_ADMIN_SOCKET_ADDRESS;
    socket = new io(serverUrl, {
        timeout: 5*1000,
        forceNew: true,
        withCredentials: true,
        reconnection: false,
        autoConnect: true
    });

    socket.on("disconnect", (reason) => {
        let disconnectReason = 'Lost connection';
        if(reason == 'io server disconnect') {
            socket.disconnect();
            socket.removeAllListener();
            disconnectReason = 'Session expired!';
        }
        eventBus.emit('adminsocket-disconnect', disconnectReason);
    });

    // connection errors
    socket.on("connect_error", (err) => {
        let reason = "Unable to connect to ProTube";
        if (err == "Error: Not authorized") {
            reason = "Unauthorized!";
        } else if(err == "Error: Unable to validate"){
            reason = "Login error!";
        }
        // eventBus.emit('to-authenticator-from-adminsocket-socket-connect-error', {reason: error});
        eventBus.emit('adminsocket-connect-error', reason);
    });

    socket.on('connect', () => {
        // eventBus.emit('to-authenticator-from-adminsocket-socket-connect-success');
        eventBus.emit('adminsocket-connect-success', socket);
    });

    // socket.on('admin-newscreencode', (screencode) => {
    //     eventBus.emit('to-adminremote-from-adminsocket-screencode-update', screencode);
    // });

    // // there was a change in the queue, update this on the admin remote
    // socket.on('admin-queue-update', (queue) => {
    //     eventBus.emit('to-adminremote-from-adminsocket-queue-update', queue);
    // });

    // // the volume on the screens was changed
    // socket.on('admin-new-volume', (volume) => {
    //     eventBus.emit('to-adminremote-from-adminsocket-new-volume', volume);
    // });
}

export function getScreenCode(){
    return new Promise( resolve => {
        socket.emit('get_screen_code', code => {
            resolve(code);
        });
    });
}

export function getUserDataSocket(){
    return new Promise( resolve => {
        socket.emit('get-user-data', (userdata) => {
            resolve(userdata);
        });
    });
}

export function getVideoQueue(){
    return new Promise(resolve => {
        socket.emit('get-video-queue', (queue) => {
            resolve(queue);
        });
    });
}

export function regenScreenCode(){
    socket.emit('create-new-screen-code');
}

export function skipSocket() {
    return new Promise(resolve => {
        socket.emit('skip', (success) => {
            resolve(success);
        });
    });
}

export function setRadio(radiostation){
    return new Promise( resolve => {
        socket.emit('set-radio', radiostation, callback => {
            resolve(callback);
        });
    });
}

export function playPauseSocket(){
    return new Promise( resolve => {
        socket.emit('play-pause', callback => {
            resolve(callback);
        });
    });
}

export function volumeChangeSocket(volume){
    return new Promise( resolve => {
        socket.emit('volume-change', volume, callback => {
            resolve(callback);
        });
    });
}