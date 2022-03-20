const fetch = require('node-fetch');
const cookie = require('cookie');
const logger = require('../utils/logger');
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

// Ignoring ssl errors on fetches
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// returns true as long as the cookie is present and valid
exports.validateClient = async (_cookies, screencode_correct=false) => {
    try {
        // extract proto_session cookie
        const proto_cookie = cookie.parse(_cookies)['proto_session'];
        // Check if we have already validated this cookie once
        const existingSession = sessionStore.findSession(proto_cookie);
        if(existingSession){
            // cookie had previously not yet authorization for a screencode
            if(screencode_correct && !existingSession.screencode_correct){
                sessionStore.deleteSession(proto_cookie);
                sessionStore.saveSession(proto_cookie, {
                    username: existingSession.username,
                    is_admin: existingSession.is_admin,
                    screencode_correct: screencode_correct
                });
            }
            return true;
        }
        // Cookie is new, validate it at the webserver
        let userdata = await fetch('https://localhost:8080/api/protube/userdetails', {
        headers: {
            cookie: `proto_session=${proto_cookie}`
        }});
        userdata = await userdata.json();
        // The cookie sent is valid
        if(userdata.authenticated){
            // Store the cookie in the session
            sessionStore.saveSession(proto_cookie, {
                username: userdata.username,
                is_admin: userdata.is_admin,
                screencode_correct: screencode_correct
            });
            return true;
        }
    } catch (e) {
        throw new Error('Error at parsing cookies');
    }
    throw new Error('Invalid session cookie');
}

exports.validateAdmin = async (_cookies) => {
    try{
        await this.validateClient(_cookies);
        // extract proto_session cookie
        const proto_cookie = cookie.parse(_cookies)['proto_session'];
        return sessionStore.findSession(proto_cookie).is_admin;
    } catch (error){
        throw new Error('Error at parsing cookies');
    }
    throw new Error('Unauthorized admin');
}

exports.getSessionData = async (_cookies) => {
    try{
        await this.validateClient(_cookies);
        // extract proto_session cookie
        const proto_cookie = cookie.parse(_cookies)['proto_session'];
        return sessionStore.findSession(proto_cookie);
    } catch (error){
        return false;
    }
}

exports.flushAllSessions = () =>{
    sessionStore.flushAllSessions();
}