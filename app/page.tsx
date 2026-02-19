
'use client';

import React, { useState, Suspense, lazy } from 'react';
import { ChatSidebar } from '../components/ChatSidebar';
import { Terminal } from '../components/Terminal';
import type { WizardData } from '../types';
import { generateCode as generateCodeService } from '../services/apiService';
// FIX: Import SandpackProvider statically and lazy-load SandpackPreview separately to resolve typing issues.
import { SandpackProvider } from '@codesandbox/sandpack-react';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));
// FIX: Use SandpackPreview to only render the preview instead of the full Sandpack component with an editor.
const SandpackPreview = lazy(() => import('@codesandbox/sandpack-react').then(module => ({ default: module.SandpackPreview })));


const EditorLoading = () => <div className="h-full w-full bg-vscode-bg-light flex items-center justify-center text-sm text-gray-400">Loading Editor...</div>;
const PreviewLoading = () => <div className="h-full w-full bg-vscode-bg-light flex items-center justify-center text-sm text-gray-400">Loading Preview...</div>;

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
                            <Suspense fallback={<EditorLoading />}>
                                <MonacoEditor 
                                    height="100%" 
                                    language="javascript" 
                                    theme="vs-dark" 
                                    value={generatedCode} 
                                    options={{ minimap: { enabled: false } }} 
                                />
                            </Suspense>
                        </div>
                        <div className="bg-vscode-bg-deep overflow-hidden">
                           <Suspense fallback={<PreviewLoading />}>
                                {/* FIX: Replaced Sandpack with SandpackProvider and SandpackPreview to fix type error and improve UI. */}
                                {/* FIX: Wrap SandpackProvider in a styled div. This sizes the Sandpack component and avoids a type error on SandpackPreview's style prop. */}
                                <div style={{ height: '100%', width: '100%' }}>
                                    <SandpackProvider 
                                        template="react" 
                                        theme="dark"
                                        files={{ '/App.js': generatedCode }} 
                                    >
                                        <SandpackPreview />
                                    </SandpackProvider>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                    <Terminal outputLines={terminalOutput} />
                </div>
            </div>
        </div>
    );
}