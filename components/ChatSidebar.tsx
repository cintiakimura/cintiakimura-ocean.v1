
'use client';

import React, { useState } from 'react';
import { FormWizard } from './FormWizard';
import type { WizardData } from '../types';

interface ChatSidebarProps {
    isWizardVisible: boolean;
    onGenerate: (data: WizardData) => void;
    isGenerating: boolean;
}

const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;


export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isWizardVisible, onGenerate, isGenerating }) => {
    const [isWizardCollapsed, setIsWizardCollapsed] = useState(false);

    return (
        <aside className="w-80 bg-vscode-sidebar flex flex-col border-r border-vscode-border flex-shrink-0">
            <div className="p-2 border-b border-vscode-border text-sm">
                <h2 className="font-bold">CHAT</h2>
            </div>
            <div className="flex-grow p-2 text-sm text-gray-400 overflow-y-auto">
                <p>Welcome! Use the wizard below to configure your application.</p>
            </div>

            {isWizardVisible && (
                 <div className="border-t border-vscode-border">
                    <button 
                        onClick={() => setIsWizardCollapsed(!isWizardCollapsed)}
                        className="w-full flex items-center p-2 text-sm font-bold uppercase hover:bg-vscode-bg-light"
                    >
                        {isWizardCollapsed ? <ChevronRight /> : <ChevronDown />}
                        <span className="ml-1">Wizard</span>
                    </button>
                    {!isWizardCollapsed && (
                        <div className="p-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 300px)'}}>
                             <FormWizard onGenerate={onGenerate} isGenerating={isGenerating} />
                        </div>
                    )}
                </div>
            )}
           
            <div className="p-2 border-t border-vscode-border">
                <input 
                    type="text" 
                    placeholder="Ask a question..." 
                    className="w-full bg-vscode-bg-light border border-vscode-border rounded-sm p-2 text-sm focus:outline-none focus:border-blue-500"
                />
            </div>
        </aside>
    );
};
