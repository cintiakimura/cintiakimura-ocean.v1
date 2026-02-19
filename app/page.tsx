
'use client';

import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { ChatSidebar } from '../components/ChatSidebar';
import { Terminal } from '../components/Terminal';
import type { WizardData } from '../types';
import { generateCode as generateCodeService } from '../services/apiService';

export default function App() {
    const [isWizardVisible, setIsWizardVisible] = useState(true);
    const [generatedCode, setGeneratedCode] = useState('// Click "Generate App" to create code...');
    const [isGenerating, setIsGenerating] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState<string[]>([
        'Vercel App Builder v1.0.0',
        'Starting development server...',
        'Ready on http://localhost:3000',
    ]);

    const handleGenerate = async (data: WizardData) => {
        setIsGenerating(true);
        setTerminalOutput(prev => [...prev, '$ app-builder generate']);
        setTerminalOutput(prev => [...prev, 'Reading wizard config... done.']);
        setTerminalOutput(prev => [...prev, 'Generating code...']);
        try {
            const code = await generateCodeService(data);
            setGeneratedCode(code);
            setTerminalOutput(prev => [...prev, '✅ Generation successful. Preview updated.']);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setGeneratedCode(`// Error: ${errorMessage}`);
            setTerminalOutput(prev => [...prev, `❌ Error: ${errorMessage}`]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-vscode-bg-deep text-vscode-text font-sans">
            <header className="flex items-center h-8 bg-vscode-header text-sm border-b border-vscode-border flex-shrink-0">
                <button 
                    onClick={() => setIsWizardVisible(!isWizardVisible)} 
                    className="px-4 h-full hover:bg-vscode-bg-light focus:outline-none"
                    aria-label="Toggle wizard visibility"
                >
                    File
                </button>
                 <button 
                    onClick={() => setIsWizardVisible(!isWizardVisible)} 
                    className="px-4 h-full hover:bg-vscode-bg-light focus:outline-none"
                    aria-label="Toggle wizard visibility"
                >
                    View
                </button>
                 <button 
                    onClick={() => setIsWizardVisible(!isWizardVisible)} 
                    className={`px-4 h-full focus:outline-none ${isWizardVisible ? 'bg-vscode-bg-light' : ''}`}
                    aria-pressed={isWizardVisible}
                 >
                    Show Wizard
                </button>
            </header>
            <div className="flex flex-grow overflow-hidden">
                <ChatSidebar 
                    isWizardVisible={isWizardVisible} 
                    onGenerate={handleGenerate} 
                    isGenerating={isGenerating} 
                />
                <div className="flex-grow flex flex-col min-w-0">
                    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-px bg-vscode-border">
                        <div className="bg-vscode-bg-deep overflow-hidden">
                            <MonacoEditor 
                                height="100%" 
                                language="javascript" 
                                theme="vs-dark" 
                                value={generatedCode} 
                                options={{ minimap: { enabled: false } }} 
                            />
                        </div>
                        <div className="bg-vscode-bg-deep overflow-hidden">
                            <Sandpack 
                                template="react" 
                                theme="dark"
                                files={{ '/App.js': generatedCode }} 
                                options={{ showLineNumbers: false, editorHeight: '100%' }} 
                            />
                        </div>
                    </div>
                    <Terminal outputLines={terminalOutput} />
                </div>
            </div>
        </div>
    );
}
