
import { GoogleGenAI, Type } from "@google/genai";
import { Episode } from '../types';

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

export const getEpisodeSummary = async (title: string, season: number, episode: number): Promise<string> => {
    const prompt = `
        Provide a detailed plot summary for the "Hart to Hart" episode titled "${title}" (Season ${season}, Episode ${episode}).
        The summary should be engaging, well-written, and capture the main plot points, including the mystery and its resolution.
        Format the output as a few paragraphs of plain text.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(`Error fetching summary for episode "${title}":`, error);
        return "Could not generate a summary for this episode at this time.";
    }
};
