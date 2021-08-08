const youtubeSearch = require('yt-search');

//Search for a YouTube video
module.exports.search = async(query) => {
    console.log(`Search initiated for query ${query}`);

    const {videos} = await youtubeSearch(query);
    if(!videos) return new Error('Could not find any videos');
    return videos.filter(video => video.seconds <= process.env.YOUTUBE_MAX_DURATION);
}
