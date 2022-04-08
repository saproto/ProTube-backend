const logger = require('../utils/logger');

regenerateAuthToken();

var timerinterval = setInterval(regenerateAuthToken, process.env.SCREENCODE_DURATION*1000 || 3600*1000);

var screenCode;

function regenerateAuthToken() {
  let setCode = parseInt(process.env.FORCE_CODE || -1);
  screenCode = setCode !== -1 ? setCode : Math.floor(1000 + Math.random() * 9000);
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