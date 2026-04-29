const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello"
    });
    console.log("gemini-2.5-flash works", response.text);
  } catch(e) {
    console.error("gemini-2.5-flash failed:", e.message);
  }
}

test();
