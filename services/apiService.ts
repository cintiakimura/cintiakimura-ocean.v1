import { GoogleGenAI } from "@google/genai";
import type { WizardData } from '../types';

const API_KEY = process.env.API_KEY || ''; // Will be set by the AI Studio environment

export const generateCode = async (data: WizardData): Promise<string> => {
  if (!API_KEY) {
    return '// ERROR: Add your API_KEY in the AI Studio environment settings.\n// Get one at https://aistudio.google.com/app/apikey';
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const serializableData = {
      ...data,
      brand: data.brand ? { name: data.brand.name, size: data.brand.size, type: data.brand.type } : null,
  };
  
  const prompt = `Generate a single-file React component (App.tsx) from this config. Use inline styles, dark theme, no extra imports except React. Output ONLY the code starting with "import React from 'react';"

Config: ${JSON.stringify(serializableData, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    
    const code = response.text?.replace(/```(tsx|jsx|javascript)?/g, '').trim();
    return code || '// No code generated';
  } catch (e) {
    console.error('Gemini API error:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return `// Failed: ${errorMessage}\n// Check your API key or rate limits.`;
  }
};
