
import type { WizardData } from '../types';

export const generateCode = (data: WizardData): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const codeString = `
// Generated at: ${new Date().toISOString()}
// Config: ${JSON.stringify(data, (key, value) => key === 'brand' ? (value ? value.name : null) : value, 2)}

import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hello, App Builder!</h1>
      <p>Your application has been generated with the following configuration:</p>
      <pre>${JSON.stringify(data, (key, value) => {
          if (key === 'brand' && value) return value.name;
          return value;
        }, 2)}
      </pre>
    </div>
  );
}
`;
      resolve(codeString);
    }, 1500);
  });
};
   