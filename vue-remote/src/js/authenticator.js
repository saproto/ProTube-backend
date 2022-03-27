import { eventBus } from '@/js/eventbus'

let socketdetails = {
    user_socket: {
        connected: false
    },
    admin_socket: {
        connected: false
    }
}

export { socketDetails }
function socketDetails(){
    return socketdetails;
}

// export { logInAdmin }
// function logInAdmin(){
//     eventBus.emit('authenticator-admin-connect-attempt');
//     return;
// }

// export { logInUser }
// function logInUser(){
//     eventBus.emit('authenticator-user-connect-attempt');
//     return;
// }

eventBus.on('admin-socket-connect-error', () => {
    socketdetails.admin_socket.connected = false;
});

eventBus.on('admin-socket-connect-success', () => {
    socketdetails.admin_socket.connected = true;
});

eventBus.on('user-socket-connect-success', () => {
    socketdetails.user_socket.connected = true;
});

eventBus.on('user-socket-connect-error', () => {
    socketdetails.user_socket.connected = false;
});

eventBus.on('admin-socket-disconnect', () => {
    socketdetails.admin_socket.connected = false;
});

eventBus.on('user-socket-disconnect', () => {
    socketdetails.user_socket.connected = false;
});