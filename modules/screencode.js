const logger = require('../utils/logger');

regenerateAuthToken();

var timerinterval = setInterval(regenerateAuthToken, process.env.SCREENCODE_DURATION*1000 || 3600*1000);

var screenCode;

function regenerateAuthToken() {
  screenCode = process.env.NODE_ENV === 'development' ? 0000 : Math.floor(1000 + Math.random() * 9000);
  logger.serverInfo(`New auth token: ${screenCode}`);
  communicator.emit('newScreenCode', screenCode);
}


exports.getScreenCode = () => {
  return screenCode;
};

exports.adminResetScreenCode = () => {
  clearInterval(timerinterval);
  timerinterval = setInterval(regenerateAuthToken, process.env.SCREENCODE_DURATION*1000 || 3600*1000);
  regenerateAuthToken();
}