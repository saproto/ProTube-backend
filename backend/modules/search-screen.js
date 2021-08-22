const express = require('express');
const crypto = require("crypto");
const { app } = require('electron');
const client = io.of('/search-screen')
const { InMemorySessionStore } = require("./sessionStore");
const { callbackify } = require('util');
const sessionStore = new InMemorySessionStore();
const youtube = require('../utils/yt');

const expireSession = 300; //time to expire the session (seconds)
let authToken = Math.floor(1000 + Math.random() * 9000);
console.log(`[SERVER] New auth token: ${authToken}`);

setInterval(regenerateAuthToken, 300*1000);

function regenerateAuthToken() {
  authToken = Math.floor(1000 + Math.random() * 9000);
  console.log(`[SERVER] New auth token: ${authToken}`);
  sessionStore.flushAllSessions();
  //disconnect all sockets
  client.disconnectSockets();
}


client.use((socket, next) => {
  console.log(`[CLIENT] Client from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  console.log(`[CLIENT] Debug: Key: ${socket.handshake.auth.token} and session ${socket.handshake.auth.sessionID}`);
  const sessionID = socket.handshake.auth.sessionID; //get the session id of the connecting user
  if(sessionID){
    console.log(`[CLIENT] Client spotted with session`);
    const existingSession = sessionStore.findSession(sessionID);
    if(existingSession){//found existing and valid session, verify age
      if(existingSession.unix+expireSession > Math.floor(new Date() / 1000)){ //age verification
        console.log(existingSession);
        console.log(`[CLIENT] Session validated`);
        socket.sessionID = sessionID;
        return next();
      }
      console.log(`[CLIENT] Session expired`);
    }
  }
  console.log(`[CLIENT] Session invalid, authing..`);
  if(validateClient(socket.handshake.auth.token)){
    //validated client, generating sessionID
    const newSessionID = crypto.randomBytes(16).toString("hex");
    sessionStore.saveSession(newSessionID, {
      unix: Math.floor(new Date() / 1000)
    });
    socket.sessionID = newSessionID;
    console.log(`[CLIENT] Saved new session`);
    return next();
  } else{
    console.log(`[CLIENT] Failed authentication`);
    return next(new Error("Not authorized"));
  }
  //end middleware
}).on('connection', socket => {
  console.log("[CLIENT] User connected succesfully!");

  //update session on client
  socket.emit("session", socket.sessionID);

  socket.on('disconnect', () => {
    console.log(`[SERVER] Disconnected socket: ${socket.id}`)
  });

  socket.on('retrieveVideos', async (search_string, callback) => {
    let videos = await youtube.search(search_string);
    callback(videos);
    console.log('[SERVER] Returned list of music to client');
  });
});

function validateClient(socketHandshakeToken){
  return socketHandshakeToken == authToken;
}


// const server = require('http').createServer(app);
// const io = require('socket.io')(server);



// const sessionMiddleware = session({
//   secret: 'keyboard cat',
//   cookie: {
//     maxAge: 10000
//   },
//   resave: true,
//   saveUninitialized: true,
// });
// register middleware in Express
//app.use(sessionMiddleware);
// register middleware in Socket.IO
// client.use((socket, next) => {
//   session({
//     secret: 'keyboard cat',
//     cookie: {
//       maxAge: 10000
//     },
//     resave: true,
//     saveUninitialized: true,
//   });
//   next();
// });

//const port = process.env.PORT || 3000;
//server.listen(port, () => console.log('server listening on port ' + port));

// const client = io.of('/search-screen')
// const crypto = require("crypto");
// const { InMemorySessionStore } = require("./sessionStore");
// const sessionStore = new InMemorySessionStore();
// const session = require('express-session');
// //var sio = require("socket.io")(server);



// const sessionMiddleware = session({ 
//   secret: 'keyboard cat', 
//   cookie: { 
//     maxAge: 10000 
//   },
//   resave: true,
//   saveUninitialized: true,
// });
// app.use(sessionMiddleware);

// //const sessionMiddleware = session({ cookie: { maxAge: 60000 }});

// // client.use((socket, next) => {
// //   const sessionID = socket.handshake.auth.sessionID;
// //   if (sessionID) {
// //     // find existing session

// //     const session = sessionStore.findSession(sessionID);
// //     if (session) {
// //       socket.sessionID = sessionID;
// //       console.log(`[CLIENT] Existing session with id: ${sessionID}`);
// //       //socket.userID = session.userID;
// //       //socket.username = session.username;
// //       next();
// //     }
// //     console.log(`[CLIENT] Invalid session`);
// //     next();
// //   } else {
// //     //generating new session
// //     console.log(`[CLIENT] No session found`);
// //     socket.sessionID = crypto.randomBytes(16).toString("hex");
// //     next();
// //   }
// // });
// client.use(sharedsession(session, {
//   autoSave:true
// })); 

// // client.use((socket, next) => {
// //   console.log(socket.request.session);
// //   sessionMiddleware(socket.request, socket.request.res, next);
// //   console.log(sessionMiddleware);
// // });
//   // //session stuff
//   // console.log(`[CLIENT] Client from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
//   // const sessionID = req.session;//socket.handshake.auth.sessionID;  //session from authing user
//   // if (sessionID) {
//   //   // find existing session
//   //   const session = sessionStore.findAllSessions();
//   //   console.log(sessionID);
//   //   if (session) {  //if found a valid session
//   //     socket.sessionID = sessionID;
//   //     console.log(`[CLIENT] Existing session with id: ${sessionID}`);
//   //     //socket.userID = session.userID;
//   //     //socket.username = session.username;
//   //     next();
//   //   }
//   //   console.log(`[CLIENT] Invalid session, authing token...`);
//   // } //no session (new user, authing it)
//   // //   //generating new session
//   // //   console.log(`[CLIENT] No session found`);
//   // //   socket.sessionID = crypto.randomBytes(16).toString("hex");
//   // //   next();
//   // // }

//   // //sessionMiddleware(socket.request, {}, next);
//   // console.log(`[CLIENT] Received auth token ${socket.handshake.auth.token}`);
//   // //let sessionExist = findSession(socket.handshake.auth.sessionID);
//   // //console.log(`[CLIENT] Session received: ${sessionExist}`);
//   // if (validateClient(socket.handshake.auth.token)) {
//   //   socket.sessionID = crypto.randomBytes(16).toString("hex");
//   //   console.log(`[CLIENT] New user, generated a new session ${socket.sessionID}`);
//   //   sessionStore.saveSession(socket.sessionID, { connected: true });
//   //   next();
//   // } else {
//   //   next(new Error("Not authorized"));
//   //   console.log(`[CLIENT] ${socket.id} failed to authorize`);
//   // }
// client.on('connection', socket => {
//   console.log(`[CLIENT] Succesfully authorized and connected client ${socket.id}`);
//   //console.log(socket.request);
//   // if (sessionStore.findSession(socket.handshake.auth.sessionID)) {
//   //   sessionStore.saveSession(socket.sessionID);
//   //   console.log(`[CLIENT] Saved new session ${socket.sessionID}`);
//   // }
//   const session = socket.request.session;
//   session.connections++;
//   session.save();
//   console.log(session);
//   //giving the client a session key
//   // socket.emit("session", {
//   //   sessionID: session.
//   // });

//   socket.on('disconnect', () => {
//     console.log(`[CLIENT] Lost connection with authorized client ${socket.id}`);
//   });
// });
//   //function to authenticate incoming socket connections
// function validateClient(socketHandshakeToken){
//     return socketHandshakeToken == process.env.WEB_CLIENT_IDENTIFIER || 123;
//   }