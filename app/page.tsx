
'use client';

import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { FormWizard } from '../components/FormWizard';
import type { WizardData } from '../types';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('// Click "Generate App" to see the code');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };
    
    const handleGenerate = async (data: WizardData) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                setGeneratedCode(result.code);
            } else {
                setGeneratedCode(`// Error: ${result.error}`);
            }
        } catch (error) {
            setGeneratedCode(`// Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
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
                         <MonacoEditor height="100%" language="javascript" theme="vs-dark" value={generatedCode} options={{ minimap: { enabled: false } }} />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                        <Sandpack template="react" theme={isDarkMode ? "dark" : "light"} files={{ '/App.js': generatedCode }} options={{ showLineNumbers: true }} />
                    </div>
                </div>
            </main>
        </div>
    );
}
