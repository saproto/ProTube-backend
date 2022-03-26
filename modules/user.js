const user = io.of('/socket/user');
const logger = require('../utils/logger');
const authenticator = require('./authenticator.js');

user.use(async (socket, next) => {
  logger.userInfo(`User from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  try{
    // if cookie is valid
    if(await authenticator.validateClient(socket.handshake.headers.cookie)){
      logger.userInfo(`Authorized user ${socket.id}`);
      return next();
      // cookie is valid but no admin
    } else {
      logger.userInfo(`${socket.id} is unauthorized`);
      return next(new Error("Not authorized"));
    }
  } catch (error){
    logger.userInfo(`${socket.id} Failed to connect with: ${error.toString()}`)
  }
  // proto_session cookie is invalid/ non existent
  logger.userInfo(`Failed authentication - ${socket.id}`);
  return next(new Error("Unable to validate"));
}).on('connection', socket => {
  logger.userInfo(`Successfully connected - ${socket.id}`);

  socket.on('disconnect', () => {
    logger.userInfo(`Disconnected user socket: ${socket.id}`)
  });

  socket.on('get-user-data', async (callback) => {
        logger.userInfo(`${socket.id} Requested user data`)
        callback(await getUserData(socket.handshake.headers.cookie));
  });

});

// get user account information such as if he/she is an admin and the name
async function getUserData(proto_session_cookie){
  try {
    userdata = await authenticator.getSessionData(proto_session_cookie);
    return {
      name: userdata.name,
      isAdmin: userdata.is_admin
  }
  } catch (e){
    console.log(e.toString());
    return false;
  }
}