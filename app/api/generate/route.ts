
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const codeString = `
// Generated at: ${new Date().toISOString()}
import React from 'react';

// A few simple icons for the UI
const Icon = ({ path }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}><path d={path} /></svg>;

const config = ${JSON.stringify(data, null, 2)};

const Card = ({ title, iconPath, children }) => (
  <div style={{ background: '#2d3748', borderRadius: '8px', padding: '1rem' }}>
    <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem', borderBottom: '1px solid #4a5568', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
      <Icon path={iconPath} /> {title}
    </h2>
    {children}
  </div>
);

export default function App() {
  const brandFile = config.brand ? \`\${config.brand.name} (\${(config.brand.size / 1024).toFixed(2)} KB)\` : 'Not provided';
  const authMethods = config.auth.length > 0 ? config.auth.join(', ').replace('_', ' ') : 'None configured';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#1a202c', color: 'white', padding: '2rem', minHeight: '100vh', lineHeight: 1.6 }}>
      <header style={{ borderBottom: '1px solid #4a5568', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Generated Application Dashboard</h1>
        <p style={{ color: '#a0aec0' }}>Brand Guide: {brandFile}</p>
      </header>
      
      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <Card title="Roles & Permissions" iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {config.roles.map(role => (
              <li key={role.name} style={{ padding: '0.5rem 0', borderBottom: '1px solid #4a5568' }}>
                <strong style={{ color: '#63b3ed' }}>{role.name || '(No name)'}</strong>: {Object.keys(role.permissions).filter(p => role.permissions[p]).join(', ')}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Application Pages" iconPath="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z">
           <p><strong>Public:</strong> {Array.isArray(config.pages.public) ? config.pages.public.join(', ') : ''}</p>
           <p><strong>Private:</strong> {Array.isArray(config.pages.private) ? config.pages.private.join(', ') : ''}</p>
        </Card>

        <Card title="Upload Configuration" iconPath="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12">
             <p><strong>Allowed Types:</strong> {config.uploads.allowedTypes}</p>
             <p><strong>Max Size:</strong> {config.uploads.maxSize}MB per user</p>
        </Card>

        <Card title="Authentication" iconPath="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
            <p><strong>Methods:</strong> {authMethods}</p>
        </Card>

        <Card title="External APIs" iconPath="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0">
            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#1a202c', padding: '0.5rem', borderRadius: '4px' }}>
                {config.apis || 'No APIs configured'}
            </p>
        </Card>
      </main>
    </div>
  );
}
`;
    return NextResponse.json({ code: codeString });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Bad request';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
