const { Server } = require('socket.io');
const io = new Server();

const clientSocketPort = 4444;
const clientSocketGateway = io.of('/petra');

io.attach(clientSocketPort, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

clientSocketGateway.use((socket, next) => {
  console.log(`[CLIENT] Client from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  if(validateClient(socket.request.headers.authorization, socket.handshake.auth.token)) {
    next();
  } else {
    next(new Error("Not authorized"));
    console.log(`[CLIENT] Socket from ${socket.handshake.address} with id ${socket.id} failed to authorize`);
  }
}).on('connection', socket => {
  console.log(`[CLIENT] Succesfully authorized client ${socket.id}`);
  socket.on('test2', function() {
    console.log('lol');
  });
  socket.emit('test');
});

//function to authenticate incoming socket connections
function validateClient(headerToken, socketToken){
  return headerToken == "123" && socketToken == "12";
}


