require('colors');

let prefix = {
    server: '[SERVER] '.yellow,
    screen: '[SCREEN] '.magenta,
    youtube: '[YOUTUBE] '.red,
    client: '[CLIENT] '.blue,
    admin: '[ADMIN] '.gray,
    queue: '[QUEUE] '.brightYellow,
    localClient: '[LOCALCLIENT] '.cyan,
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

exports.youtubeInfo = message => {
    console.log(prefix.youtube + message);
}

exports.clientInfo = message => {
    console.log(prefix.client + message);
}

exports.adminInfo = message => {
    console.log(prefix.admin + message);
}

exports.queueInfo = message => {
    console.log(prefix.queue + message.yellow);
}

exports.localClientInfo = message => {
    console.log(prefix.localClient + message);
}