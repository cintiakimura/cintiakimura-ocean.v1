'use client';

import React, { useState, Suspense, lazy, type PropsWithChildren } from 'react';
import { ChatSidebar } from '../components/ChatSidebar';
import { Terminal } from '../components/Terminal';
import type { WizardData } from '../types';
import { generateCode as generateCodeService } from '../services/apiService';
import { SandpackProvider } from '@codesandbox/sandpack-react';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));
const SandpackPreview = lazy(() => import('@codesandbox/sandpack-react').then(module => ({ default: module.SandpackPreview })));

// A standard React Error Boundary component to catch rendering errors in its children.
// Fix: Use PropsWithChildren for robust typing of component props, resolving a type error.
// Fix: Explicitly defining props for the ErrorBoundary component to resolve type errors with `this.props`.
interface ErrorBoundaryProps {
    children?: React.ReactNode;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 p-4">Something went wrong: {this.state.error?.message}</div>;
    }

    // As requested for debugging, check for invalid child objects. The primary cause
    // of React error #31 is often a library version mismatch, but this guard helps
    // catch invalid renderables being passed as children.
    React.Children.forEach(this.props.children, (child) => {
        // This check identifies objects that are not valid React elements.
        if (child && typeof child === 'object' && !React.isValidElement(child)) {
            console.error(
                'ErrorBoundary detected an invalid child object. ' + 
                'This is not a renderable React element and will cause errors.',
                child
            );
        }
    });

    // There are no conditional returns of plain objects; this correctly returns children.
    return this.props.children;
  }
}

// DEBUG: Wrapper component to help diagnose rendering issues as requested.
// Fix: Use PropsWithChildren for robust typing of component props.
function DebugWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {children}
      <div className="hidden">Debug: children type = {typeof children}</div>
    </>
  );
}

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
                    <ErrorBoundary>
                        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-px bg-vscode-border">
                            <div className="bg-vscode-bg-deep overflow-hidden">
                                <DebugWrapper>
                                    <Suspense fallback={<EditorLoading />}>
                                        <MonacoEditor 
                                            height="100%" 
                                            language="javascript" 
                                            theme="vs-dark" 
                                            value={generatedCode} 
                                            options={{ minimap: { enabled: false } }} 
                                        />
                                    </Suspense>
                                </DebugWrapper>
                            </div>
                            <div className="bg-vscode-bg-deep overflow-hidden">
                               <DebugWrapper>
                                    <Suspense fallback={<PreviewLoading />}>
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
                               </DebugWrapper>
                            </div>
                        </div>
                    </ErrorBoundary>
                    <Terminal outputLines={terminalOutput} />
                </div>
            </div>
        </div>
    );
}