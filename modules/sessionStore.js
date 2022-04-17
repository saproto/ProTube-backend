const cookie = require('cookie');
const { getCurrentUnix } = require('../utils/time-formatter');
const logger = require('../utils/logger');

/* abstract */ class SessionStore {
    findSession(id) {}
    saveSession(id, sessiondata) {}
    findAllSessions() {}
    flushAllSessions() {}
    async flushAllRemotes() {}
    deleteSession(id) {}
    async flushExpiredSessions() {}
  }
  
  class InMemorySessionStore extends SessionStore {
    constructor() {
      super();
      this.sessions = new Map();
    }
  
    findSession(id) {
      return this.sessions.get(id);
    }
  
    saveSession(id, sessiondata) {
      this.sessions.set(id, sessiondata);
    }
  
    findAllSessions() {
      return [...this.sessions.values()];
    }

    async flushAllRemotes(){
      logger.sessionStoreInfo("Flushing all remotes");
      const remotesockets = await io.of('/socket/remote').fetchSockets();

      this.findAllSessions().forEach((session) => {
        session.screencode_correct = false;
        return session;
      })

      // disconnecting all remotes
      remotesockets.forEach((socket) => {
        socket.disconnect();
      });

    }

    flushAllSessions(){
        logger.sessionStoreInfo("Flushing all sessions");
        this.sessions = new Map();
    }

    async flushExpiredSessions(){
      logger.sessionStoreInfo('Starting session flushing');

      const currentUnix = getCurrentUnix();
      // gather all sockets on the server
      const usersockets = await io.of('/socket/user').fetchSockets();
      const adminsockets = await io.of('/socket/admin').fetchSockets();
      const remotesockets = await io.of('/socket/remote').fetchSockets();

      // list of sessions to kill
      let killist = new Map();
      let sessions = this.findAllSessions();
      sessions.forEach((session) => {
        if(session.unix <= currentUnix){
          killist.set(session.session_id, session)
        }
      });

      const flushedAdmins = await this.flushAndDisconnect(adminsockets, killist, currentUnix);
      const flushedUsers = await this.flushAndDisconnect(usersockets, killist, currentUnix);
      const flushedRemotes = await this.flushAndDisconnect(remotesockets, killist, currentUnix);
  
      killist.forEach((session) => {
        this.deleteSession(session.session_id)
      });

      logger.sessionStoreInfo(`Flushed ${flushedAdmins + flushedRemotes + flushedUsers} sockets and ${killist.size} sessions!`)

      return;
    }

    async flushAndDisconnect(sockets, killist, currentUnix){
      let flushed = 0;
      sockets.forEach((socket) => {
        try {
          // extract proto_session cookie and look up if there is a session to kill
          const proto_cookie = cookie.parse(socket.handshake.headers.cookie)['proto_session'];
          const session = killist.get(proto_cookie);
          
          if(session){
              // disconnect sockets which have an expired creation stamp
              if(session.unix <= currentUnix) socket.disconnect();
              flushed += 1;
          }

        // error at cookie parsing, kill the socket anyway
        } catch (e){
          logger.sessionStoreInfo(e.toString());
          socket.disconnect();
        }
      })
      return flushed;
    }

    deleteSession(id){
        this.sessions.delete(id);
    }
  }

 module.exports = {
   InMemorySessionStore,
//   SessionStore
 };
  