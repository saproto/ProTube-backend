const logger = require('../utils/logger');

regenerateAuthToken();

setInterval(regenerateAuthToken, process.env.SCREENCODE_DURATION*1000 || 3600*1000);

var screenCode;

function regenerateAuthToken() {
  screenCode = Math.floor(1000 + Math.random() * 9000);
  logger.serverInfo(`New auth token: ${screenCode}`);
  communicator.emit('newScreenCode', screenCode);
}


exports.getScreenCode = () => {
  return screenCode;
};