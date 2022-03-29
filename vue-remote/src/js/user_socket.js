const io = window.io = require('socket.io-client');
var socket;
import { eventBus } from '@/js/eventbus.js';
// duplicated eventbus!
export { connectUserSocket };

function connectUserSocket(){
    const serverUrl = process.env.VUE_APP_USER_SOCKET_ADDRESS;
    socket = new io(serverUrl, {
        timeout: 5*1000,
        forceNew: true,
        withCredentials: true,
        reconnection: false,
        autoConnect: true,
    });

    socket.on("disconnect", (reason) => {
        if(reason == 'io server disconnect') {
            socket.disconnect();
            return eventBus.emit('to-authenticator-from-usersocket-socket-disconnect', 'Session expired!');
        }
        eventBus.emit('to-authenticator-from-usersocket-socket-disconnect', 'Lost connection');
    });

    // connection errors
    socket.on("connect_error", (err) => {
        let error = "Unable to connect to ProTube";
        if (err == "Error: Not authorized") {
            error = "Unauthorized!";
        } else if(err == "Error: Unable to validate"){
            error = "Login error!";
        }
        eventBus.emit('to-authenticator-from-usersocket-socket-connect-error', {reason: error});
        eventBus.emit('to-loginpage-from-usersocket-socket-connect-error', {reason: error});
    });

    socket.on('connect', () => {
        eventBus.emit('to-loginpage-from-usersocket-socket-connect-success');
        eventBus.emit('to-authenticator-from-usersocket-socket-connect-success');
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