const { Server } = require("socket.io");
const io = new Server();

const serverPort = 3000;

let authorizedSocketId;

const namespace = io.of("/petra");

io.attach(serverPort, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

io.on('test2', function(){
  console.log("lol");
})

namespace.on('test2', function(){
  console.log("lol");
})

namespace.use((socket, next) => {
  console.log("Client spotted, validating..");
  if (validateClient(socket.request.headers.authorization, socket.handshake.auth.token)) {
    next();
  } else {
    next(new Error("Not authorized"));
  }
  //debug auth tokens
  //console.log(socket.request.headers.authorization);  //token in the header
  //console.log(socket.handshake.auth.token); //token somewhere in the auth of the socket
}).on("connection", function(socket){
  console.log("Authorized! Client id: "+socket.id);
  authorizedSocketId = socket.id;
  namespace.to(authorizedSocketId).emit('test');
});

//function to authenticate incoming socket connections
function validateClient( headerToken, socketToken){
  if(headerToken == "123" && socketToken == "12"){
    return true;
  }
  return false;
}

io.on('disconnect', function() {
  console.log("disconnected")
});


