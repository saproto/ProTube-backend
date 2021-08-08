require('dotenv').config();
const { Server } = require('socket.io');
const io = new Server();

const clientSocketPort = 4444;
const clientSocketGateway = io.of('/petra');

io.attach(clientSocketPort, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});
console.log(`[SERVER] Created socketio server at :${clientSocketPort}${clientSocketGateway.name}`);

clientSocketGateway.use((socket, next) => {
  console.log(`[CLIENT] Client from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  if(validateClient(socket.handshake.auth.token)) {
    next();
  } else {
    next(new Error("Not authorized"));
    console.log(`[CLIENT] ${socket.id} failed to authorize`);
  }
}).on('connection', socket => {
  console.log(`[CLIENT] Succesfully authorized client ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[CLIENT] Lost connection with authorized client ${socket.id}`);
  });
  socket.emit('test');
});

//function to authenticate incoming socket connections
function validateClient(socketHandshakeToken){
  return socketHandshakeToken === process.env.CLIENT_IDENTIFIER;
}


