const socekt = io.of('/local-client');
const logger = require('../utils/logger');
let lastKnownCode;

socekt.use((socket, next) => {
    logger.localClientInfo(`Client from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
    if(validateClient(socket.handshake.auth.token)) {
      next();
    } else {
      next(new Error("Not authorized"));
      logger.localClientInfo(`${socket.id} failed to authorize`);
    }
  }).on('connection', socket => {
    logger.localClientInfo(`Succesfully authorized client ${socket.id}`);
    socket.emit('newScreenCode', (lastKnownCode));

    socket.on('disconnect', () => {
      logger.localClientInfo(`Lost connection with authorized client ${socket.id}`);
    });

    communicator.on('newScreenCode', (code) => {
        socket.emit('newScreenCode', (code));
    });

    // //testing! for sending a sound
    // setTimeout(function() {
    //   let sound = "test2.mp3"
    //   console.log(`[CLIENT] Playing sound ${sound}`);
    //   socket.emit('playsound', sound);
    // }, 3000);
  });
  
communicator.on('newScreenCode', (code) => {
    lastKnownCode = code;
});

  //function to authenticate incoming socket connections
  function validateClient(socketHandshakeToken){
    return socketHandshakeToken === process.env.CLIENT_IDENTIFIER;
  }