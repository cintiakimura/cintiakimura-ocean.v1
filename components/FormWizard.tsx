
'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import type { WizardData, Role } from '../types';

interface FormWizardProps {
    onGenerate: (data: WizardData) => void;
    isGenerating: boolean;
}

const initialData: WizardData = {
    roles: [{ id: Date.now(), name: 'Admin', permissions: { view: true, edit: true, delete: true, invite: true } }],
    pages: { public: ['landing', 'login'], private: ['dashboard', 'settings'] },
    uploads: { allowedTypes: '.png, .jpg, .pdf', maxSize: 10 },
    auth: ['email_password'],
    brand: null,
    apis: 'Stripe, SendGrid'
};

const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

const AccordionSection = ({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="border-b border-vscode-border">
        <button type="button" onClick={onToggle} className="w-full flex items-center p-2 text-sm font-bold uppercase hover:bg-vscode-bg-light" aria-expanded={isOpen}>
            {isOpen ? <ChevronDown /> : <ChevronRight />}
            <span className="ml-1">{title}</span>
        </button>
        {isOpen && <div className="p-3 bg-vscode-bg-deep">{children}</div>}
    </div>
);

export const FormWizard: React.FC<FormWizardProps> = ({ onGenerate, isGenerating }) => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<WizardData>({ defaultValues: initialData });
    const { fields, append, remove } = useFieldArray({ control, name: "roles" });
    const [openSection, setOpenSection] = useState<string>('Roles');

    const handleToggle = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
    };

    const processForm: SubmitHandler<WizardData> = data => {
        onGenerate(data);
    };

    return (
        <form onSubmit={handleSubmit(processForm)} className="flex flex-col h-full">
            <div className="flex-grow space-y-1">
                <AccordionSection title="Roles" isOpen={openSection === 'Roles'} onToggle={() => handleToggle('Roles')}>
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-3 border border-vscode-border rounded-md mb-2 bg-vscode-bg-light">
                             <label htmlFor={`roles.${index}.name`} className="sr-only">Role Name</label>
                             <input id={`roles.${index}.name`} {...register(`roles.${index}.name`, { required: "Role name is required" })} className="w-full bg-transparent border-b border-vscode-border p-1 mb-2 text-sm" placeholder="Role Name" />
                             {errors.roles?.[index]?.name && <p className="text-red-400 text-xs mt-1">{errors.roles[index]?.name?.message}</p>}
                            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                {Object.keys(initialData.roles[0].permissions).map(p => (
                                    <label key={p} htmlFor={`roles.${index}.permissions.${p}`} className="flex items-center space-x-2"><input id={`roles.${index}.permissions.${p}`} type="checkbox" {...register(`roles.${index}.permissions.${p as keyof Role['permissions']}`)} /><span>{p}</span></label>
                                ))}
                            </div>
                            <button type="button" onClick={() => remove(index)} className="text-red-500 text-xs mt-2 hover:underline">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ id: Date.now(), name: '', permissions: { view: true, edit: false, delete: false, invite: false }})} className="w-full text-center p-2 bg-blue-600 hover:bg-blue-700 rounded-md mt-2 text-sm">Add Role</button>
                </AccordionSection>

                <AccordionSection title="Pages" isOpen={openSection === 'Pages'} onToggle={() => handleToggle('Pages')}>
                    <div className="space-y-4 text-sm">
                        <label htmlFor="pages.public" className="block">Public Pages (comma-separated)</label>
                        <input id="pages.public" className="w-full p-2 mt-1 rounded-sm bg-vscode-bg-light border border-vscode-border" {...register('pages.public', {setValueAs: v => typeof v === 'string' ? v.split(',').map(s=>s.trim()) : v})} />
                        
                        <label htmlFor="pages.private" className="block">Private Pages (comma-separated)</label>
                        <input id="pages.private" className="w-full p-2 mt-1 rounded-sm bg-vscode-bg-light border border-vscode-border" {...register('pages.private', {setValueAs: v => typeof v === 'string' ? v.split(',').map(s=>s.trim()) : v})} />
                    </div>
                </AccordionSection>
                
                <AccordionSection title="Uploads" isOpen={openSection === 'Uploads'} onToggle={() => handleToggle('Uploads')}>
                    <div className="space-y-4 text-sm">
                        <label htmlFor="uploads.allowedTypes" className="block">Allowed File Types</label>
                        <input id="uploads.allowedTypes" className="w-full p-2 mt-1 rounded-sm bg-vscode-bg-light border border-vscode-border" {...register('uploads.allowedTypes', { required: "Specify allowed file types" })} />
                        {errors.uploads?.allowedTypes && <p className="text-red-400 text-xs">{errors.uploads.allowedTypes.message}</p>}

                        <label htmlFor="uploads.maxSize" className="block">Max Size (MB)</label>
                        <input id="uploads.maxSize" type="range" min="1" max="100" {...register('uploads.maxSize', {valueAsNumber: true})} className="w-full mt-1"/>
                    </div>
                </AccordionSection>
                
                <AccordionSection title="Auth" isOpen={openSection === 'Auth'} onToggle={() => handleToggle('Auth')}>
                     <div className="space-y-2 text-sm">
                        <label htmlFor="auth.email" className="flex items-center space-x-2 p-2 rounded-md bg-vscode-bg-light"><input id="auth.email" type="checkbox" {...register('auth')} value="email_password" /><span>Email/Password</span></label>
                        <label htmlFor="auth.google" className="flex items-center space-x-2 p-2 rounded-md bg-vscode-bg-light"><input id="auth.google" type="checkbox" {...register('auth')} value="google" /><span>Google SSO</span></label>
                    </div>
                </AccordionSection>

                 <AccordionSection title="Brand" isOpen={openSection === 'Brand'} onToggle={() => handleToggle('Brand')}>
                     <div className="text-sm">
                        <label htmlFor="brand.file" className="block mb-2">Brand Guide (optional)</label>
                        <input id="brand.file" type="file" {...register('brand', {setValueAs: v => v && v.length > 0 ? v[0] : null })} className="w-full text-xs"/>
                    </div>
                 </AccordionSection>
                
                 <AccordionSection title="APIs" isOpen={openSection === 'APIs'} onToggle={() => handleToggle('APIs')}>
                     <div className="text-sm">
                        <label htmlFor="apis.list" className="block mb-2">External APIs (comma-separated)</label>
                        <textarea id="apis.list" rows={3} className="w-full p-2 rounded-sm bg-vscode-bg-light border border-vscode-border" {...register('apis')}></textarea>
                    </div>
                 </AccordionSection>
            </div>
            <div className="mt-auto pt-4 border-t border-vscode-border">
                 <button type="submit" disabled={isGenerating} className="w-full px-4 py-2 rounded-md bg-green-600 text-white disabled:bg-green-800 disabled:cursor-not-allowed text-sm">
                    {isGenerating ? 'Generating...' : 'Generate App'}
                </button>
            </div>
        </form>
    );
};
