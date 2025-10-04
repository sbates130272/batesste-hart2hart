import { GoogleGenAI, Type } from "@google/genai";
import { Episode, EpisodeDetails } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const EPISODE_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            season: {
                type: Type.INTEGER,
                description: 'The season number.'
            },
            episode: {
                type: Type.INTEGER,
                description: 'The episode number within the season.'
            },
            title: {
                type: Type.STRING,
                description: 'The title of the episode.'
            },
        },
        required: ['season', 'episode', 'title'],
    },
};

export const getEpisodeList = async (): Promise<Episode[]> => {
    const prompt = `
        Generate a complete list of all episodes for the TV series "Hart to Hart" (1979-1984).
        Return the list as a JSON array, with each object containing 'season', 'episode', and 'title'.
        The list should be in chronological order by season, then by episode number.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: EPISODE_SCHEMA,
            },
        });
        const jsonText = response.text;
        const episodes = JSON.parse(jsonText);
        return episodes;
    } catch (error) {
        console.error("Error fetching episode list from Gemini:", error);
        throw new Error("Failed to parse episode list from Gemini API.");
    }
};

const EPISODE_DETAILS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: 'A detailed plot summary for the episode.'
        },
        youtubeLink: {
            type: Type.STRING,
            description: 'A URL to a YouTube search for the full episode.'
        },
    },
    required: ['summary', 'youtubeLink'],
};

export const getEpisodeDetails = async (title: string, season: number, episode: number): Promise<EpisodeDetails> => {
    const prompt = `
        Provide a detailed plot summary for the "Hart to Hart" episode titled "${title}" (Season ${season}, Episode ${episode}).
        Also, provide a YouTube search URL that is most likely to contain the full episode. A good search query would be "Hart to Hart S${season.toString().padStart(2,'0')}E${episode.toString().padStart(2,'0')} ${title}".
        Return the result as a JSON object with two keys: "summary" and "youtubeLink". The youtubeLink value should be a full URL.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: EPISODE_DETAILS_SCHEMA,
            },
        });
        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error(`Error fetching details for episode "${title}":`, error);
        const fallbackSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(`Hart to Hart ${title}`)}`;
        return {
            summary: "Could not generate a summary for this episode at this time. Please try again later.",
            youtubeLink: fallbackSearch,
        };
    }
};
