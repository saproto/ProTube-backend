const io = window.io = require('socket.io-client');
let socket = null;
import { eventBus } from '@/js/eventbus.js';
let player;
let nowPlaying;

// called by the yt iframe api, this triggers the entire screen
export function onYouTubeIframeAPIReady() {
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
export function resetYTplayer(){
    nowPlaying = null;
}

export function youtubePlayerReady() {
    socket.emit('request-player-status');
    socket.on('player-status', data => {
        if (data.type === 'video') {
            nowPlaying = data.video;
            if (player.videoId !== nowPlaying.id) {
                player.loadVideoById(nowPlaying.id);
                player.setPlaybackQuality('hd1080');
                setTimeout(() => {
                    player.playVideo();
                }, 100);
            }

            switch (data.status) {
                case 'playing':
                    player.playVideo();
                    break;
                case 'paused':
                    player.pauseVideo();
                    break;
                case 'idle':
                    player.stopVideo();
                    break;
            }
        }
    });

    // used for video synchronizations
    socket.on('new-timestamp', timestamp => {
        if (Math.abs(player.getCurrentTime() - timestamp.seconds) > 5)
            player.seekTo(timestamp.seconds, true);
    });
    // update the screencode on the screen 
    socket.on('new-screencode', new_code => {
        eventBus.emit('to-adminprotubescreen-from-screensocket-new-screencode', new_code);
    });
}
// exiting the page, kill the socket
export function killSocket() {
    socket.disconnect();
}