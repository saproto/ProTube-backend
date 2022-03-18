/* abstract */ class SessionStore {
    findSession(id) {}
    saveSession(id, sessiondata) {}
    findAllSessions() {}
    flushAllSessions() {}
    deleteSession(id) {}
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

    flushAllSessions(){
        this.sessions = new Map();
    }

    deleteSession(id){
        this.sessions.delete(id);
    }
  }

 module.exports = {
   InMemorySessionStore,
//   SessionStore
 };
  