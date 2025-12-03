import { GoogleGenAI, Type } from "@google/genai";
import { TravelPackage, Place } from "../types";

// SET THIS TO TRUE IF YOU ARE RUNNING THE NODE.JS SERVER (npm start)
// SET THIS TO FALSE FOR CLIENT-SIDE ONLY PREVIEW
const USE_NODE_SERVER = false; 

const API_BASE_URL = 'http://localhost:3000/api';
const apiKey = process.env.API_KEY || "";

const ai = new GoogleGenAI({ apiKey });

export const getCityDetails = async (cityName: string): Promise<TravelPackage | null> => {
  // Option 1: Fetch from Node.js Backend
  if (USE_NODE_SERVER) {
    try {
      const response = await fetch(`${API_BASE_URL}/trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: cityName }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json() as TravelPackage;
    } catch (error) {
      console.error("Error fetching from Node server:", error);
      // Fallback to client-side if server fails or not running
      console.warn("Falling back to client-side generation...");
    }
  }

  // Option 2: Client-side generation (Default for Preview)
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `Create a detailed travel package for ${cityName}. 
    I need the following information in strict JSON format:
    - city: The name of the city
    - country: The country it belongs to
    - description: A captivating 2-sentence description of the destination
    - duration: Recommended duration (e.g., "5 Days / 4 Nights")
    - cost: Estimated cost for a couple in USD (e.g., "$1,200 - $1,500")
    - coordinates: The latitude and longitude of the city center
    - places: A list of 5 specific famous places/attractions to visit within the city. For each place, provide its name, a short description, and its coordinates (lat, lng).
    - itinerary: An array of objects with 'day' (number) and 'activity' (string summary of the day) for the recommended duration (max 5 days)
    - bestTime: Best months to visit
    - themes: A list of 3 travel themes (e.g., "Adventure", "Honeymoon", "Cultural")
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            country: { type: Type.STRING },
            description: { type: Type.STRING },
            duration: { type: Type.STRING },
            cost: { type: Type.STRING },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              }
            },
            places: { 
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  coordinates: {
                    type: Type.OBJECT,
                    properties: {
                      lat: { type: Type.NUMBER },
                      lng: { type: Type.NUMBER }
                    }
                  }
                }
              }
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  activity: { type: Type.STRING }
                }
              }
            },
            bestTime: { type: Type.STRING },
            themes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as TravelPackage;

  } catch (error) {
    console.error("Error fetching travel details:", error);
    return null;
  }
};

export const getNearbyPlaces = async (lat: number, lng: number, cityName: string): Promise<Place[]> => {
  if (USE_NODE_SERVER) {
    try {
      const response = await fetch(`${API_BASE_URL}/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, city: cityName }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json() as Place[];
    } catch (error) {
      console.error("Error fetching nearby places from server:", error);
    }
  }

  // Client-side fallback
  if (!apiKey) return [];

  try {
    const model = "gemini-2.5-flash";
    const prompt = `Find 3 interesting places to visit near latitude ${lat} and longitude ${lng} in or near ${cityName}. 
    These should be distinct from major landmarks if possible (hidden gems, local favorites, cafes, parks).
    Return strict JSON array of objects with:
    - name: Name of the place
    - description: Very short description (10 words max)
    - coordinates: { lat, lng }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              coordinates: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Place[];
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return [];
  }
};