import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize environment variables
// In a local setup, you would require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the build directory (usually dist or build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// API Endpoint to generate travel package
app.post('/api/trip', async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const model = "gemini-2.5-flash";
    const prompt = `Create a detailed travel package for ${city}. 
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
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text);
    res.json(data);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to generate travel package" });
  }
});

// API Endpoint to find nearby places
app.post('/api/nearby', async (req, res) => {
  try {
    const { lat, lng, city } = req.body;

    if (!lat || !lng || !city) {
      return res.status(400).json({ error: 'Coordinates and city are required' });
    }

    const model = "gemini-2.5-flash";
    const prompt = `Find 3 interesting places to visit near latitude ${lat} and longitude ${lng} in or near ${city}. 
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
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    res.json(data);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});

// Catch-all handler for React SPA (Client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});