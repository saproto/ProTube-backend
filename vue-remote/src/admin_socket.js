const io = window.io = require('socket.io-client');
var socket;
import { eventBus } from '@/eventbus.js';

export { connectAdminSocket };

function connectAdminSocket(proto_session){
    const serverUrl = process.env.VUE_APP_ADMIN_SOCKET_ADDRESS;
    socket = new io(serverUrl, {
        auth: {
            token: proto_session, //socket handshake token
        },
        timeout: 2*1000,
        forceNew: true,
        reconnection: false,
        autoConnect: false,
    });
    socket.connect();

    socket.on("disconnect", (reason) => {
        console.log("disconnected socket: " + reason);
    });

    // connection errors
    socket.on("connect_error", (err) => {
        console.log(err);
        let error = "Unknown error occurred";
        if (err == "Error: Not authorized") {
            error = "Unauthorized!";
        }
        eventBus.emit('admin-socket-connect-error', {
            reason: error
        });
    });

    socket.on('connect', () => {
        eventBus.emit('admin-socket-connect-success');
    });

    socket.on('admin-newscreencode', (screencode) => {
        eventBus.emit('admin-newscreencode', screencode);
    });
}

export { getScreenCode }
async function getScreenCode(){
    console.log("requested screencode");
    return new Promise( resolve => {
        socket.emit('get_screen_code', code => {
            resolve(code);
        });
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