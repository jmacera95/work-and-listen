import videosDevData from "../data/videos.json";
import { watchedVideos, favouritedVideos } from "./db/hasura";

const fetchVideos = async (url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    const BASE_URL = "youtube.googleapis.com/youtube/v3";
    const response = await fetch(`https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`);

    return await response.json();
}


export const getCommonVideos = async (url) => {
    

    try {
        const isDev = process.env.DEVELOPMENT == 'true';

        const data = isDev ? videosDevData : await fetchVideos(url);

        if (data?.error) {
            console.error("Youtube API error", data.error);
            return [];
        }
        
        return data?.items.map(item => {
            const id = item.id?.videoId || item.id;
            const snippet = item.snippet;
            return {
                id,
                title: snippet.title,
                imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                description: snippet.description,
                channelTitle: snippet.channelTitle,
                publishTime: snippet.publishedAt,
                statistics: item.statistics ? item.statistics : { viewCount: 0 },
            }
        })
    } catch (error) {
        console.error("Something went wrong.", error);
        return [];
    }
};

export const getVideos = (searchQuery) => {
    const URL = `search?part=snippet&q=${searchQuery}&type=video`;

    return getCommonVideos(URL);
};

export const getPopularVideos = () => {
    const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=AR&videoCategoryId=10";

    return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

    return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async(token, userId) => {
    const videos = await watchedVideos(token, userId);

    return videos?.map((video) => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
        }
    })
}

export const getFavouritedVideos = async(token, userId) => {
    const videos = await favouritedVideos(token, userId);

    return videos?.map((video) => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
        }
    })
}