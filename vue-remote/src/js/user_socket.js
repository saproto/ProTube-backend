const io = window.io = require('socket.io-client');
var socket;
import { eventBus } from '@/js/eventbus.js';

export function connectUserSocket(){
    const serverUrl = `${process.env.VUE_APP_SOCKET_ADDRESS}/socket/user`;
    socket = new io(serverUrl, {
        timeout: 5*1000,
        forceNew: true,
        withCredentials: true,
        reconnection: false,
        autoConnect: true,
    });

    socket.on("disconnect", (reason) => {
        let disconnectReason = 'Lost connection';
        if(reason == 'io server disconnect') {
            socket.disconnect();
            disconnectReason = 'Session expired!';
        }
        eventBus.emit('usersocket-disconnect', disconnectReason);
    });

    // connection errors
    socket.on("connect_error", (err) => {
        let reason = "Unable to connect to ProTube";
        if (err == "Error: Not authorized") {
            reason = "Unauthorized!";
        } else if(err == "Error: Unable to validate"){
            reason = "Login error!";
        }
        eventBus.emit('usersocket-connect-error', reason);
        // eventBus.emit('to-loginpage-from-usersocket-socket-connect-error', {reason: error});
    });

    socket.on('connect', () => {
        eventBus.emit('usersocket-connect-success');
        // eventBus.emit('to-authenticator-from-usersocket-socket-connect-success');
    });
}

export function getUserData(){
    return new Promise( resolve => {
        socket.emit('get-user-data', (userdata) => {
            resolve(userdata);
        });
    });
}

export function getUserVideoQueueSocket(){
    return new Promise( resolve => {
        socket.emit('get-user-queue', (queue) => {
            resolve(queue);
        });
    });
}