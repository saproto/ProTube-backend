const io = window.io = require('socket.io-client');
var socket;
import { eventBus } from '@/eventbus.js';

export { connectUserSocket };

function connectUserSocket(){
    const serverUrl = process.env.VUE_APP_USER_SOCKET_ADDRESS;
    socket = new io(serverUrl, {
        timeout: 5*1000,
        forceNew: false,
        withCredentials: true,
        reconnection: true,
        autoConnect: true,
    });

    socket.on("disconnect", (reason) => {
        console.log("disconnected socket: " + reason);
    });

    // connection errors
    socket.on("connect_error", (err) => {
        let error = "Unknown error occurred";
        if (err == "Error: Not authorized") {
            error = "Unauthorized!";
        } else if(err == "Error: Unable to validate"){
            error = "Login error!";
        }
        eventBus.emit('user-socket-connect-error', {
            reason: error
        });
    });

    socket.on('connect', () => {
        console.log("success!");
        eventBus.emit('user-socket-connect-success');
    });
}

export { getUserData }
async function getUserData(){
    return new Promise( resolve => {
        socket.emit('get-user-data', (userdata) => {
            resolve(userdata);
        });
    });
}