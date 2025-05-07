// services/YouTubeService.ts
import { GeminiResource } from './GeminiService2';

// Use the YouTube Data API key you provided
const YOUTUBE_API_KEY = "AIzaSyCTHSNna2ZmAGVrN70gV32WssqyKAo_0CY";

interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchResult[];
}

/**
 * Search YouTube for videos matching a topic in a specific language
 */
export const searchYoutubeVideos = async (
  topic: string,
  language: string,
  maxResults: number = 5
): Promise<GeminiResource[]> => {
  try {
    // Define language codes for YouTube API relevanceLanguage parameter
    const languageCodeMap: Record<string, string> = {
      english: 'en',
      kannada: 'kn',
      telugu: 'te',
      hindi: 'hi',
      tamil: 'ta',
      french: 'fr',
      japanese: 'ja',
      italian: 'it'
    };
    
    // Default to English if no matching language code
    const languageCode = languageCodeMap[language.toLowerCase()] || 'en';
    
    // Add language terms to search query for better results
    let searchQuery = topic;
    if (language.toLowerCase() !== 'english') {
      // If searching for non-English content, include the language name in the query
      searchQuery = `${topic} ${language}`;
    }
    
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('type', 'video');
    url.searchParams.append('relevanceLanguage', languageCode);
    url.searchParams.append('videoCaption', 'any');
    url.searchParams.append('videoDuration', 'medium'); // Filter for medium length videos (4-20 minutes)
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);
      throw new Error(`YouTube API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json() as YouTubeSearchResponse;
    
    if (!data.items || data.items.length === 0) {
      console.warn('No videos found for:', searchQuery);
      return [];
    }

    // Transform YouTube results to GeminiResource format
    return data.items
      .filter(item => item.id.videoId) // Only include items with videoId
      .map(item => ({
        id: `youtube-${item.id.videoId}`,
        title: item.snippet.title,
        description: item.snippet.description || `YouTube video about ${topic} in ${language}`,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        category: 'YouTube',
        verified: true,
        language,
        videoId: item.id.videoId,
        thumbnailUrl: item.snippet.thumbnails.high.url
      }));
      
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw error;
  }
};

/**
 * Verify if a YouTube video exists and is available
 */
export const verifyYouTubeVideo = async (videoId: string): Promise<boolean> => {
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.append('part', 'status');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) return false;

    const data = await response.json();
    return data.items && data.items.length > 0;
  } catch (error) {
    console.error('Error verifying YouTube video:', error);
    return false;
  }
};

/**
 * Get video details for a specific YouTube video ID
 */
export const getYouTubeVideoDetails = async (videoId: string): Promise<GeminiResource | null> => {
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.append('part', 'snippet,contentDetails,statistics');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.items || data.items.length === 0) return null;
    
    const video = data.items[0];
    return {
      id: `youtube-${video.id}`,
      title: video.snippet.title,
      description: video.snippet.description || 'YouTube video',
      url: `https://www.youtube.com/watch?v=${video.id}`,
      category: 'YouTube',
      verified: true,
      videoId: video.id,
      thumbnailUrl: video.snippet.thumbnails.high.url
    };
  } catch (error) {
    console.error('Error getting YouTube video details:', error);
    return null;
  }
};