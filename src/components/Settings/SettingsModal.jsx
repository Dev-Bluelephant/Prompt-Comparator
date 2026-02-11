import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onSave, initialSettings }) => {
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('gpt-3.5-turbo');
    const [systemPromptA, setSystemPromptA] = useState('');
    const [systemPromptB, setSystemPromptB] = useState('');

    useEffect(() => {
        if (isOpen) {
            setApiKey(initialSettings.apiKey || '');
            setModel(initialSettings.model || 'gpt-3.5-turbo');
            setSystemPromptA(initialSettings.systemPromptA || 'You are a helpful assistant.');
            setSystemPromptB(initialSettings.systemPromptB || 'You are a helpful assistant.');
        }
    }, [isOpen, initialSettings]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ apiKey, model, systemPromptA, systemPromptB });
        onClose();
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        fontSize: '0.875rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Configuration</h2>
                    <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    <div>
                        <label style={labelStyle}>OpenAI API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Model</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                            <option value="gpt-4">gpt-4</option>
                            <option value="gpt-4-turbo">gpt-4-turbo</option>
                            <option value="gpt-4o">gpt-4o</option>
                            <option value="gpt-4o-mini">gpt-4o-mini</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ ...labelStyle, color: 'var(--accent-prompt-a)' }}>System Prompt A</label>
                            <textarea
                                value={systemPromptA}
                                onChange={(e) => setSystemPromptA(e.target.value)}
                                rows={6}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>
                        <div>
                            <label style={{ ...labelStyle, color: 'var(--accent-prompt-b)' }}>System Prompt B</label>
                            <textarea
                                value={systemPromptB}
                                onChange={(e) => setSystemPromptB(e.target.value)}
                                rows={6}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'var(--accent-primary)',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 500
                            }}
                        >
                            <Save size={18} />
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
