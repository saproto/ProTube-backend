const socket = io('/screen');

let player;
let current;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: 'dQw4w9WgXcQ',
        playerVars: {
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            iv_load_policy: 3,
        },
        events: {
            onReady: youtubePlayerReady
        }
    });
}

const youtubePlayerReady = () => {
    socket.emit('request-player-status');

    socket.on('player-status', data => {
        nowPlaying = data.video;
        try {
            if(current !== nowPlaying.videoId)
            player.loadVideoById(nowPlaying.videoId);
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
        console.log('new timestamp: ' + timestamp);
        if(Math.abs(player.getCurrentTime() - timestamp.seconds) > 5 )
            player.seekTo(timestamp.seconds, true);
    });
}