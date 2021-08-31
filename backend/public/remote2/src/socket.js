//main eventbus for entire vue programm
import mitt from "mitt";
export const eventBus = mitt();

const io = window.io = require('socket.io-client');

//resetSocket();
var socket;
let silentConnect = false;

export { initializeSocket };

function resetSocket(pincode){
    //socket.removeAllListeners();
    const serverPort = 3000;
    const serverHost = 'http://localhost';
    const serverUrl = `${serverHost}:${serverPort}/search-screen`;
    let localSessionID = localStorage.getItem("sessionID");
    socket = new io(serverUrl, {
        auth: {
            token: pincode, //socket handshake token
            sessionID: localSessionID
        },
        timeout: 1*1000,
        forceNew: true,
        reconnection: false,
        autoConnect: false,
    });
    if(pincode || localSessionID){
        console.log("reconnecting with pincode or session");
        connectSocket(socket);
    } else{
        silentConnect = false;
    }
    return;
}

function connectSocket(_socket){
    _socket.connect();
    console.log("reconnect attempt");

    eventBus.on('fetchVideos', (search_string) => {
        _socket.emit("retrieveVideos", search_string, (response) => {
            if (response == "Could not find any videos") {
                return;
            } else {
                eventBus.emit('displayVideos', response);
            }
        });
    });

    _socket.on("session", sessionID => {
        // attach the session ID to the next reconnection attempts
        socket.auth = sessionID;
        // store it in the localStorage
        localStorage.setItem("sessionID", sessionID);
        //toggleModal(false);
    });

    _socket.on("disconnect", () => {
        socket.disconnect();
        socket.removeAllListeners();
        eventBus.emit('toggleLoginModalVisible', true);
        //resetSocket();
    });

    _socket.on("connect_error", (err) => {
        console.log("connect erro " + silentConnect + " <- silent");
        if(!silentConnect){
            if (err == "Error: Not authorized") {
                //toggleModal(true, "Unauthorized");
                eventBus.emit('pinEntered-callback', {
                    success: false,
                    reason: "PIN invalid"
                });
            } else {
                //toggleModal(true, "Unknown error");
                eventBus.emit('pinEntered-callback', {
                    success: false,
                    reason: "Unknown error"
                });
            }
        } else{
            silentConnect = false;
        }
    });

    _socket.on('connect', () => {
        console.log("spotted her");
        eventBus.emit('pinEntered-callback', {
            success: true,
            reason: ""
        });
        setTimeout(function(){ eventBus.emit('toggleLoginModalVisible', false) }, 1000);
        // save the ID of the user
    });
}

function initializeSocket(){
    resetSocket();
    silentConnect = true;
}

eventBus.on('pinEntered', (pincode) =>{
    if(pincode != ''){
        silentConnect = false;
        resetSocket(pincode);
    }
});

// socket.on('connect', (socket) => {
//     console.log("connected");
//     let silentConnect = true;
//         socket.on("disconnect", (reason) => {
//             //socket.disconnect();
//             //resetSocket();
//             if (reason === "io server disconnect") {
//                 eventBus.emit('toggleLoginModalVisible', true);
//             } else {
//                 eventBus.emit('toggleLoginModalVisible', true);
//             }
//         });

//         eventBus.on('fetchVideos', (search_string) => {
//     socket.emit("retrieveVideos", search_string, (response) => {
//         if (response == "Could not find any videos") {
//             return;
//         } else {
//             eventBus.emit('displayVideos', response);
//         }
//     });
// });

//         //called on socket connection error
//         socket.on("connect_error", (err) => {
//             if(!silentConnect){
//                 if (err == "Error: Not authorized") {
//                     //toggleModal(true, "Unauthorized");
//                     eventBus.emit('pinEntered-callback', {
//                         success: false,
//                         reason: "PIN invalid"
//                     });
//                 } else {
//                     //toggleModal(true, "Unknown error");
//                     eventBus.emit('pinEntered-callback', {
//                         success: false,
//                         reason: "Unknown error"
//                     });
//                 }
//             } else{
//                 silentConnect = false;
//             }
//         });



//         socket.on("session", sessionID => {
//             // attach the session ID to the next reconnection attempts
//             socket.auth = sessionID;
//             eventBus.emit('pinEntered-callback', {
//                 success: true,
//                 reason: ""
//             });
//             // store it in the localStorage
//             localStorage.setItem("sessionID", sessionID);
//             // save the ID of the user
//             setTimeout(
//             eventBus.emit('toggleLoginModalVisible', false), 1000);
//             //toggleModal(false);
//         });
//     });

// //main eventbus for entire vue programm
// import mitt from "mitt";
// export const eventBus = mitt();

// const io = window.io = require('socket.io-client');

// resetSocket();

// export { initializeSocket };

// function resetSocket(pincode){
//     //socket.removeAllListeners();
//     const serverPort = 3000;
//     const serverHost = 'http://localhost';
//     const serverUrl = `${serverHost}:${serverPort}/search-screen`;
//     let localSessionID = localStorage.getItem("sessionID");
//     const socket = new io(serverUrl, {
//         auth: {
//             token: pincode, //socket handshake token
//             sessionID: localSessionID
//         },
//         timeout: 10*1000,
//         forceNew: true,
//         reconnection: false,
//         autoConnect: false,
//     });
//     if(pincode || localSessionID){
//         console.log("reconnecting with pincode or session");
//         connectSocket(socket, localSessionID);
//     }
//     return;
// }

// function connectSocket(socket, silent){
//     socket.connect();
//     let silentConnect = silent;

//     eventBus.on('fetchVideos', (search_string) => {
//         socket.emit("retrieveVideos", search_string, (response) => {
//             if (response == "Could not find any videos") {
//                 return;
//             } else {
//                 eventBus.emit('displayVideos', response);
//             }
//         });
//     });

//     socket.on("session", sessionID => {
//         // attach the session ID to the next reconnection attempts
//         socket.auth = sessionID;
//         eventBus.emit('pinEntered-callback', {
//             success: true,
//             reason: ""
//         });
//         // store it in the localStorage
//         localStorage.setItem("sessionID", sessionID);
//         // save the ID of the user
//         setTimeout(
//         eventBus.emit('toggleLoginModalVisible', false), 1000);
//         //toggleModal(false);
//     });

//     socket.on("disconnect", (reason) => {
//         socket.disconnect();
//         socket.removeAllListeners();
//         if (reason === "io server disconnect") {
//             eventBus.emit('toggleLoginModalVisible', true);
//         } 
//         resetSocket();
//     });

//     socket.on("connect_error", (err) => {
//         console.log("connect erro");
//         if(!silentConnect){
//             if (err == "Error: Not authorized") {
//                 //toggleModal(true, "Unauthorized");
//                 eventBus.emit('pinEntered-callback', {
//                     success: false,
//                     reason: "PIN invalid"
//                 });
//             } else {
//                 //toggleModal(true, "Unknown error");
//                 eventBus.emit('pinEntered-callback', {
//                     success: false,
//                     reason: "Unknown error"
//                 });
//             }
//         } else{
//             silentConnect = false;
//         }
//     });

//     socket.on('connect', () => {
//         console.log("spotted her");
//     });
// }

// function initializeSocket(){
//     resetSocket();
// }

// eventBus.on('pinEntered', (pincode) =>{
//     if(pincode != ''){
//         resetSocket(pincode);
//     }
// });

