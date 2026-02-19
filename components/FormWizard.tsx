
'use client';

import React, { useState } from 'react';
import type { WizardData, Role } from '../types';

interface FormWizardProps {
    onGenerate: (data: WizardData) => void;
    isGenerating: boolean;
}

const initialData: WizardData = {
    roles: [{ id: 1, name: 'Admin', permissions: { view: true, edit: true, delete: true, invite: true } }],
    pages: { public: ['landing', 'login'], private: ['dashboard'] },
    uploads: { allowedTypes: 'png, jpg, pdf', maxSize: 10 },
    auth: ['email_password'],
    brand: null,
    apis: 'Stripe, SendGrid'
};

const steps = ['Roles', 'Pages', 'Uploads', 'Auth', 'Brand', 'APIs'];

export const FormWizard: React.FC<FormWizardProps> = ({ onGenerate, isGenerating }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<WizardData>(initialData);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handlePermissionChange = (id: number, permission: string, value: boolean) => {
         setFormData(prev => ({
            ...prev,
            roles: prev.roles.map(r => r.id === id ? { ...r, permissions: {...r.permissions, [permission]: value} } : r)
        }));
    }

    const addRole = () => {
        setFormData(prev => ({
            ...prev,
            roles: [...prev.roles, { id: Date.now(), name: 'New Role', permissions: { view: true, edit: false, delete: false, invite: false } }]
        }));
    };

    const removeRole = (id: number) => {
        setFormData(prev => ({ ...prev, roles: prev.roles.filter(r => r.id !== id) }));
    };

    const renderStepContent = () => {
        switch (steps[currentStep]) {
            case 'Roles':
                return (
                    <div>
                        {formData.roles.map(role => (
                            <div key={role.id} className="p-3 border rounded-md mb-2 bg-bkg">
                                <input value={role.name} onChange={(e) => setFormData(p => ({...p, roles: p.roles.map(r => r.id === role.id ? {...r, name: e.target.value} : r)}))} className="w-full bg-transparent border-b p-1 mb-2"/>
                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    {Object.keys(role.permissions).map(p => (
                                        <label key={p} className="flex items-center"><input type="checkbox" checked={role.permissions[p as keyof Role['permissions']]} onChange={e => handlePermissionChange(role.id, p, e.target.checked)} className="mr-2"/> {p} </label>
                                    ))}
                                </div>
                                <button onClick={() => removeRole(role.id)} className="text-red-500 text-xs mt-2">Remove</button>
                            </div>
                        ))}
                        <button onClick={addRole} className="w-full text-center p-2 bg-primary text-primary-content rounded-md mt-2 text-sm">Add Role</button>
                    </div>
                );
            case 'Pages':
                 return <div>
                    <label className="font-semibold mb-2 block">Public Pages (comma-separated)</label>
                    <input className="w-full p-2 rounded-md bg-bkg border" value={formData.pages.public.join(', ')} onChange={e => setFormData(f => ({...f, pages: {...f.pages, public: e.target.value.split(',').map(s=>s.trim())}}))}/>
                     <label className="font-semibold my-2 block">Private Pages (comma-separated)</label>
                    <input className="w-full p-2 rounded-md bg-bkg border" value={formData.pages.private.join(', ')} onChange={e => setFormData(f => ({...f, pages: {...f.pages, private: e.target.value.split(',').map(s=>s.trim())}}))}/>
                 </div>
            case 'Uploads':
                return <div>
                    <label className="block mb-2">Allowed File Types</label>
                    <input className="w-full p-2 rounded-md bg-bkg border" value={formData.uploads.allowedTypes} onChange={e => setFormData(f => ({...f, uploads: {...f.uploads, allowedTypes: e.target.value}}))}/>
                    <label className="block mt-4 mb-2">Max Size (MB) per user: {formData.uploads.maxSize}MB</label>
                    <input type="range" min="1" max="100" value={formData.uploads.maxSize} onChange={e => setFormData(f => ({...f, uploads: {...f.uploads, maxSize: +e.target.value}}))} className="w-full"/>
                </div>
            case 'Auth':
                return <div>
                    <label className="flex items-center p-2 rounded-md bg-bkg mb-2"><input type="checkbox" className="mr-2" checked={formData.auth.includes('email_password')} onChange={e => setFormData(f => ({...f, auth: e.target.checked ? [...f.auth, 'email_password'] : f.auth.filter(a => a !== 'email_password')}))}/> Email/Password</label>
                    <label className="flex items-center p-2 rounded-md bg-bkg"><input type="checkbox" className="mr-2" checked={formData.auth.includes('google')} onChange={e => setFormData(f => ({...f, auth: e.target.checked ? [...f.auth, 'google'] : f.auth.filter(a => a !== 'google')}))}/> Google SSO</label>
                </div>
            case 'Brand':
                return <div>
                     <label className="block mb-2">Brand Guide (optional)</label>
                    <input type="file" onChange={e => setFormData(f => ({...f, brand: e.target.files ? e.target.files[0] : null}))} className="w-full text-sm"/>
                    {formData.brand && <p className="text-xs mt-2 text-content/70">Selected: {formData.brand.name}</p>}
                </div>
            case 'APIs':
                 return <div>
                     <label className="block mb-2">External API Services (comma-separated)</label>
                     <textarea rows={4} className="w-full p-2 rounded-md bg-bkg border" value={formData.apis} onChange={e => setFormData(f => ({...f, apis: e.target.value}))}></textarea>
                 </div>
            default: return null;
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-semibold">{steps[currentStep]}</h2>
                <span className="text-sm text-content/60">{currentStep + 1} / {steps.length}</span>
            </div>
            
            <div className="flex-grow mb-4">{renderStepContent()}</div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted/20">
                <button onClick={handlePrev} disabled={currentStep === 0} className="px-4 py-2 rounded-md bg-muted/50 disabled:opacity-50">Prev</button>
                {currentStep === steps.length - 1 ? (
                    <button onClick={() => onGenerate(formData)} disabled={isGenerating} className="px-4 py-2 rounded-md bg-green-600 text-white disabled:bg-green-800 disabled:cursor-not-allowed">
                        {isGenerating ? 'Generating...' : 'Generate App'}
                    </button>
                ) : (
                    <button onClick={handleNext} className="px-4 py-2 rounded-md bg-primary text-primary-content">Next</button>
                )}
            </div>
        </div>
    );
};
