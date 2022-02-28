const admin = io.of('/socket/admin');
const logger = require('../utils/logger');
const screenCode = require('./screencode')

admin.use((socket, next) => {
  logger.adminInfo(`Admin from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  if(validateAdmin(socket.handshake.auth.token)){
    //validated admin, generating sessionID
    logger.adminInfo(`Authorized admin ${socket.id}`);
    return next();
  }
  logger.adminInfo(`Failed authentication - ${socket.id}`);
  return next(new Error("Not authorized"));
  //end middleware
}).on('connection', socket => {
  logger.adminInfo(`Successfully connected - ${socket.id}`);

  socket.on('disconnect', () => {
    logger.adminInfo(`Disconnected admin socket: ${socket.id}`)
  });

  socket.on('get_screen_code', callback => {
    logger.adminInfo(`Requested the screen code: ${socket.id}`);
    callback(screenCode.getScreenCode());
  });
});

communicator.on('newScreenCode', (screenCode) => {
  admin.emit('admin-newscreencode', screenCode);
});

// use this function to authorize an incoming admin request (return a boolean)
function validateAdmin(proto_session_token){
  let isAuthorized = true;
  // let isAuthorized = false;
  return isAuthorized;
}