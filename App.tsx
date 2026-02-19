
import React, { useState, useEffect } from 'react';
import { FormWizard } from './components/FormWizard';
import MonacoEditor from '@monaco-editor/react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { generateCode } from './services/apiService';
import type { WizardData } from './types';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('// Click "Generate App" to see the code');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            // FIX: Corrected a typo in localStorage.setItem to store 'dark' instead of 'theme' for the dark mode theme.
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    const handleGenerate = async (data: WizardData) => {
        setIsGenerating(true);
        const code = await generateCode(data);
        setGeneratedCode(code);
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-bkg text-content font-sans">
            <header className="flex items-center justify-between p-4 border-b border-muted/20">
                <h1 className="text-xl font-bold">Personal App Builder</h1>
                <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-muted/50">
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </header>
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-2 p-2 h-[calc(100vh-65px)]">
                <div className="lg:col-span-1 overflow-y-auto rounded-lg bg-muted/20 p-4">
                    <FormWizard onGenerate={handleGenerate} isGenerating={isGenerating} />
                </div>
                <div className="lg:col-span-2 grid grid-rows-2 gap-2">
                     <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
                         <MonacoEditor
                            height="100%"
                            language="javascript"
                            theme="vs-dark"
                            value={generatedCode}
                            options={{ minimap: { enabled: false } }}
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                        <Sandpack
                            template="react"
                            theme={isDarkMode ? "dark" : "light"}
                            files={{
                                '/App.js': generatedCode.replace('Hello', '<h1>Hello World</h1>'),
                            }}
                            options={{ showLineNumbers: true }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}