import { eventBus } from '@/js/eventbus'
import { connectAdminSocket } from "@/js/admin_socket";
import { connectUserSocket } from "@/js/user_socket";

let socketdetails = {
    user_socket: {
        connected: false
    },
    admin_socket: {
        connected: false
    }
}
let currentRoute = null;

export function socketDetails(){
    return socketdetails;
}

export function logInAdmin(){
    connectAdminSocket();
    return;
}

export function logInUser(){
    connectUserSocket();
    return;
}

export function setCurrentRoute(route){
    currentRoute = route;
}

// on disconnect redirect to login page to reauthenticate
eventBus.on('to-authenticator-from-adminsocket-socket-disconnect', (reason) => {
    socketdetails.admin_socket.connected = false;
    if(reason == 'Session expired!') return redirectToSessionExpired(currentRoute);
    
    return eventBus.emit('authenticator-router-push', {
        name: 'Login', 
        params: {
            targetPath: currentRoute,
            requests_admin: true
        }
    });
});

// on disconnect redirect to login page to reauthenticate
eventBus.on('to-authenticator-from-usersocket-socket-disconnect', (reason) => {
    socketdetails.user_socket.connected = false;
    if(reason == 'Session expired!') return redirectToSessionExpired(currentRoute);
    
    return eventBus.emit('authenticator-router-push', {
        name: 'Login', 
        params: {
            targetPath: currentRoute,
            requests_admin: false
        }
    });
});


function redirectToSessionExpired(path){
    // prevent duplicate from error to error on second socket disconnect
    if(path == 'Error') return;

    return eventBus.emit('authenticator-router-push', { 
        name: 'Error', 
        params: {
            'errorCode': 440,
            'sourcePath': path
        }            
    });
}

    eventBus.on('to-authenticator-from-adminsocket-socket-connect-error', () => {
        socketdetails.admin_socket.connected = false;
    });

    eventBus.on('to-authenticator-from-adminsocket-socket-connect-success', () => {
        socketdetails.admin_socket.connected = true;
    });

    eventBus.on('to-authenticator-from-usersocket-socket-connect-success', () => {
        socketdetails.user_socket.connected = true;
    });

    eventBus.on('to-authenticator-from-usersocket-socket-connect-error', () => {
        socketdetails.user_socket.connected = false;
    });
