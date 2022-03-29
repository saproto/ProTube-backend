require('colors');

let prefix = {
    server: '[SERVER] '.yellow,
    screen: '[SCREEN] '.magenta,
    youtube: '[YOUTUBE] '.red,
    client: '[REMOTECLIENT] '.blue,
    admin: '[ADMIN] '.gray,
    user: '[USER] '.green,
    queue: '[QUEUE] '.brightYellow,
    localClient: '[LOCALCLIENT] '.cyan,
    session: '[SESSIONSTORE] '.blue,

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

exports.userInfo = message => {
    console.log(prefix.user + message);
}

exports.queueInfo = message => {
    console.log(prefix.queue + message.yellow);
}

exports.localClientInfo = message => {
    console.log(prefix.localClient + message);
}

exports.sessionStoreInfo = message => {
    console.log(prefix.session + message);
}