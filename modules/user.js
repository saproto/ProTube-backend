const user = io.of('/socket/user');
const logger = require('../utils/logger');

user.use((socket, next) => {
  logger.userInfo(`User from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  if(this.logInUser(socket.handshake.auth.token)){
    //validated admin, generating sessionID
    logger.userInfo(`Authorized user ${socket.id}`);
    return next();
  }
  logger.userInfo(`Failed authentication - ${socket.id}`);
  return next(new Error("Not authorized"));
  //end middleware
}).on('connection', socket => {
  const proto_session_token = socket.handshake.auth.token;
  logger.userInfo(`Successfully connected - ${socket.id}`);

  socket.on('disconnect', () => {
    logger.userInfo(`Disconnected user socket: ${socket.id}`)
  });

  socket.on('get-user-data', (callback) => {
        logger.userInfo(`${socket.id} Requested user data`)
        callback(this.getUserData(proto_session_token));
  });

});

// check if the session token is valid and the user exists
exports.logInUser = (proto_session_token) => {
  let isAuthorized = true;
  // let isAuthorized = false;
  return isAuthorized;
}

// get user account information such as if he/she is an admin and the name
exports.getUserData = (proto_session_token) => {
    return {
        username: "Henk",
        isAdmin: true
    }
}