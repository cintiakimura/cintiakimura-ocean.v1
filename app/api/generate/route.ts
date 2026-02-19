// FIX: Replaced the mock code generation logic with a call to the Gemini API to generate React code based on the user's form input. This provides a dynamic and powerful code generation capability.
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { WizardData } from '../../../types';

export async function POST(request: Request) {
  try {
    const data: WizardData = await request.json();

    if (!process.env.API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Since File object cannot be serialized, we just note its presence.
    const serializableData = {
        ...data,
        brand: data.brand ? { name: "Uploaded File" } : null
    };
    
    const prompt = `Generate a single-file React functional component named 'App' based on the following JSON configuration. 
The generated component should be a complete working example that reflects all the settings in the configuration.
The output must be only the raw JSX code, without any extra explanations, comments, or markdown formatting like \`\`\`jsx.

Configuration:
${JSON.stringify(serializableData, null, 2)}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Good for complex reasoning and coding
        contents: prompt,
        config: {
            systemInstruction: "You are an expert React developer specializing in creating single-file application prototypes from a configuration object. Your response must be only the code for the React component.",
            temperature: 0.2, // Lower temperature for more deterministic code output
        }
    });

    let code = response.text || '// Failed to generate code. Please try again.';

    // Clean up potential markdown formatting from the response
    if (code.startsWith('```jsx')) {
      code = code.substring(5, code.length - 3).trim();
    } else if (code.startsWith('```javascript')) {
      code = code.substring(13, code.length - 3).trim();
    } else if (code.startsWith('```')) {
      code = code.substring(3, code.length - 3).trim();
    }
    
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to generate code: ${errorMessage}` }, { status: 500 });
  }
}
