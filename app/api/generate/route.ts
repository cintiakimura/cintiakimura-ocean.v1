// FIX: Replaced mock response with a call to the Gemini API for dynamic code generation.
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import type { WizardData } from '../../../types';

export async function POST(request: Request) {
  try {
    const data: WizardData = await request.json();

    // The brand object is not serialized properly from a File object, so we create a descriptive string for the prompt.
    const promptData = {
      ...data,
      brand: data.brand ? "A brand guide file has been provided. Please generate a UI with a generic but professional corporate theme." : "No brand guide file provided."
    };

    const prompt = `
You are an expert full-stack developer specializing in React, Next.js, and Tailwind CSS.
Your task is to generate the code for a single React component that represents a web application's main page.
The component should be generated based on the following configuration provided by the user.
The output MUST be only the JavaScript/JSX code for the component, with no explanations or markdown formatting like \`\`\`jsx.

Configuration:
${JSON.stringify(promptData, null, 2)}

Instructions:
- Create a functional React component named 'App'.
- Use React hooks for state management if needed.
- Style the application using Tailwind CSS classes. You can assume Tailwind is set up.
- The layout should be clean and modern.
- Based on the 'roles', create a simple user management UI.
- Based on the 'pages', create a navigation bar.
- Based on the 'uploads', create a file upload section.
- Based on the 'auth', show which authentication methods are available.
- If a 'brand' guide is mentioned, use a professional, corporate color scheme.
- Based on the 'apis', list the integrated external services.

Generate the complete, runnable React component code below.
`;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Complex Text Tasks (coding)
        contents: prompt
    });

    const codeString = response.text;

    if (!codeString) {
      return NextResponse.json({ error: 'Failed to generate code from AI. The response was empty.' }, { status: 500 });
    }

    return NextResponse.json({ code: codeString });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to generate code: ${errorMessage}` }, { status: 500 });
  }
}
