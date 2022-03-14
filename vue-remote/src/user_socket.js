const io = window.io = require('socket.io-client');
var socket;
import { eventBus } from './eventbus';

export { connectUserSocket };

function connectUserSocket(proto_session){
    const serverUrl = process.env.VUE_APP_USER_SOCKET_ADDRESS;
    socket = new io(serverUrl, {
        auth: {
            token: proto_session, //socket handshake token
        },
        timeout: 2*1000,
        forceNew: true,
        reconnection: true,
        autoConnect: false,
    });
    socket.connect();

    socket.on("disconnect", (reason) => {
        console.log("disconnected socket: " + reason);
    });

    // connection errors
    socket.on("connect_error", (err) => {
        let error = "Unknown error occurred";
        if (err == "Error: Not authorized") {
            error = "Unauthorized!";
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