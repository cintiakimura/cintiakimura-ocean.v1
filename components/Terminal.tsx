
'use client';

import React, { useEffect, useRef } from 'react';

interface TerminalProps {
    outputLines: string[];
}

export const Terminal: React.FC<TerminalProps> = ({ outputLines }) => {
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [outputLines]);

    return (
        <div className="h-40 bg-vscode-bg-deep border-t border-vscode-border p-2 font-mono text-sm text-vscode-text flex-shrink-0">
             <div className="w-full h-full overflow-y-auto">
                {outputLines.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                        <span className="text-gray-500 mr-2">&gt;</span>
                        <span>{line}</span>
                    </div>
                ))}
                <div ref={terminalEndRef} />
            </div>
        </div>
    );
};
