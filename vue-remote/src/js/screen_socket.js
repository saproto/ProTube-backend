const io = window.io = require('socket.io-client');
let socket = null;
import { eventBus } from '@/js/eventbus.js';
let player;
let current;
let radio = false;
let nowPlaying;

// called by the yt iframe api, this triggers the entire screen
export { onYouTubeIframeAPIReady }
function onYouTubeIframeAPIReady() {
    createSocket();
    player = new window.YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: '',
        playerVars: {
            autoplay: 1,
            mute: 0,
            enablejsapi: 1,
            modestbranding: 1
        },
        events: {
            'onReady': window.youtubePlayerReady,
        }
    });
}

function createSocket(){
    socket = new io('http://localhost:3000/screen', {
        timeout: 5*1000,
        forceNew: true,
        withCredentials: true,
        reconnection: true,
        autoConnect: true
    });
}

// on going back to the screen reset it so onytiframeapiready can be triggered successfully
export { resetYTplayer }
function resetYTplayer(){
    current = null;
    nowPlaying = null;
    radio = false;
}

export { youtubePlayerReady }
// eslint-disable-next-line
const youtubePlayerReady = (event) => {
    console.log("player ready ");
    console.log(player);
    socket.emit('request-player-status');
    socket.on('player-status', data => {
        console.log(data);
        nowPlaying = data.video;
        try {
            if(current !== nowPlaying.videoId && data.status != 'radio' && data.status != 'radio-ending'){
                player.loadVideoById(nowPlaying.videoId);
                player.setPlaybackQuality('hd1080');
                setTimeout(() => {
                    player.playVideo();
                } ,100);
                current = nowPlaying.videoId;
            } else if( data.status == 'radio' || data.status == 'radio-ending'){
                eventBus.emit('radio_playing', nowPlaying);
            }
            if( data.status == 'radio-ending'){
                eventBus.emit('show-screencode');
            }
        }catch(e) {
            //We're either not playing anything or the data was sent wrong.
            console.log(e.toString());
        }
        switch(data.status) {
            case 'playing': player.playVideo(); break;
            case 'paused': player.pauseVideo(); break;
            case 'idle': player.stopVideo(); break;
        }
    });

    // used for video synchronizations
    socket.on('new-timestamp', timestamp => {
        if(radio){
            socket.emit('request-player-status');
            radio = false;
            eventBus.emit('radio_playing', "");
            player.playVideo();
        }
        console.log(timestamp.seconds);
        console.log(player.getCurrentTime() - timestamp.seconds)
        if(Math.abs(player.getCurrentTime() - timestamp.seconds) > 5 )
            player.seekTo(timestamp.seconds, true);
    });

    // a radio station was requested
    socket.on('new-radio', new_radio => {
        player.stopVideo();
        radio = true;
        eventBus.emit('radio_playing', new_radio);
    });

    // update the screencode on the screen 
    socket.on('new-screencode', new_code => {
        eventBus.emit('new-screencode', new_code);
    }); 

    // re-show screencode on radio -> protube switch
    socket.on('show-screencode', () => {
        eventBus.emit('show-screencode');
    });

    // exiting the page, kill the socket
    eventBus.on('screen-kill-sockets', () => {
        console.log("killing screen socket")
        socket.disconnect();
    });
}