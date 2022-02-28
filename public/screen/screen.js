const socket = io('/screen');

let player;
let current;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: '',
        playerVars: {
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            autoplay: 1,
            mute: 0,
            enablejsapi: 1
        },
        events: {
            'onReady': youtubePlayerReady,
        }
    });
}

const youtubePlayerReady = (event) => {
    //console.log("ready");
    player.unMute();
    socket.emit('request-player-status');
    socket.on('player-status', data => {
        nowPlaying = data.video;
        try {
            if(current !== nowPlaying.videoId)
            player.loadVideoById(nowPlaying.videoId);
            player.setPlaybackQuality('highres');
            // setTimeout(() => {
            //     player.playVideo();
            // } ,100);
            current = nowPlaying.videoId;
        }catch(e) {
            //We're either not playing anything or the data was sent wrong.
        }
        switch(data.status) {
            case 'playing': player.playVideo(); break;
            case 'paused': player.pauseVideo(); break;
            case 'idle': player.stopVideo(); break;
        }
    });

    socket.on('new-timestamp', timestamp => {
        if(Math.abs(player.getCurrentTime() - timestamp.seconds) > 5 )
            player.seekTo(timestamp.seconds, true);
    });
}