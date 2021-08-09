require('colors');

let prefix = {
    server: '[SERVER] '.yellow,
    screen: '[SCREEN] '.magenta,
}

exports.serverInfo = message => {
    console.log(prefix.server + message.green);
};

exports.serverError = message => {
    console.log(prefix.server + message.red);
}

exports.screenInfo = message => {
    console.log(prefix.screen + message.brightMagenta);
}