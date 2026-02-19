'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Home() {
  const [code, setCode] = useState(`export default function App() {
  return <h1 style={{ fontFamily: 'sans-serif' }}>Hello, Ocean v1!</h1>;
}`);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('Wizard submit:', data);
    // Gemini call placeholder
  };

  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Preview</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      </head>
      <body style="margin: 0; padding: 0;">
        <div id="root"></div>
        <script type="text/babel">
          try {
            ${code}
            const container = document.getElementById('root');
            const root = ReactDOM.createRoot(container);
            root.render(<App />);
          } catch (error) {
            document.getElementById('root').innerHTML = '<pre style="color: red; padding: 1rem;">' + error + '</pre>';
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">Ocean v1 - Code Wizard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <label htmlFor="code-editor" className="block mb-2 text-lg font-medium">Edit Code</label>
          <textarea
            id="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-medium">Live Preview</label>
          <iframe
            srcDoc={iframeContent}
            title="Live Preview"
            className="w-full h-96 border border-gray-700 rounded-lg bg-white"
            sandbox="allow-scripts"
          />
        </div>
      </div>

      <footer className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto lg:mx-0">
          <label htmlFor="project-name" className="sr-only">Project Name</label>
          <input
            id="project-name"
            {...register('projectName')}
            placeholder="Project name"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Generate with Gemini
          </button>
          <p className="text-sm text-gray-400 mt-2 text-center lg:text-left">
            Need a Gemini API key? Get it free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">aistudio.google.com</a>, then add it to your project's environment variables as <code>API_KEY</code>.
          </p>
        </form>
      </footer>
    </div>
  );
}