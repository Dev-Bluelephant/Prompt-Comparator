import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onSave, initialSettings }) => {
    const [apiKey, setApiKey] = useState('');
    const [anthropicKey, setAnthropicKey] = useState('');
    const [googleKey, setGoogleKey] = useState('');
    const [model, setModel] = useState('gpt-3.5-turbo');
    const [systemPromptA, setSystemPromptA] = useState('');
    const [systemPromptB, setSystemPromptB] = useState('');
    const [promptNameA, setPromptNameA] = useState('');
    const [promptNameB, setPromptNameB] = useState('');

    useEffect(() => {
        if (isOpen) {
            setApiKey(initialSettings.apiKey || '');
            setAnthropicKey(initialSettings.anthropicKey || '');
            setGoogleKey(initialSettings.googleKey || '');
            setSystemPromptA(initialSettings.systemPromptA || 'You are a helpful assistant.');
            setSystemPromptB(initialSettings.systemPromptB || 'You are a helpful assistant.');
            setPromptNameA(initialSettings.promptNameA || 'Prompt A');
            setPromptNameB(initialSettings.promptNameB || 'Prompt B');
        }
    }, [isOpen, initialSettings]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            apiKey,
            anthropicKey,
            googleKey,
            systemPromptA,
            systemPromptA,
            systemPromptB,
            promptNameA,
            promptNameB
        });
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

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>API Keys</h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>OpenAI API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Anthropic API Key</label>
                            <input
                                type="password"
                                value={anthropicKey}
                                onChange={(e) => setAnthropicKey(e.target.value)}
                                placeholder="sk-ant-..."
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Google Gemini API Key</label>
                            <input
                                type="password"
                                value={googleKey}
                                onChange={(e) => setGoogleKey(e.target.value)}
                                placeholder="AIza..."
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ ...labelStyle, color: 'var(--accent-prompt-a)' }}>System Prompt A</label>
                                <textarea
                                    value={systemPromptA}
                                    onChange={(e) => setSystemPromptA(e.target.value)}
                                    rows={4}
                                    style={{ ...inputStyle, resize: 'vertical', marginBottom: 0 }}
                                />
                            </div>
                            <div>
                                <label style={{ ...labelStyle, color: 'var(--accent-prompt-b)' }}>System Prompt B</label>
                                <textarea
                                    value={systemPromptB}
                                    onChange={(e) => setSystemPromptB(e.target.value)}
                                    rows={4}
                                    style={{ ...inputStyle, resize: 'vertical', marginBottom: 0 }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Prompt Name A</label>
                            <input
                                type="text"
                                value={promptNameA}
                                onChange={(e) => setPromptNameA(e.target.value)}
                                placeholder="e.g. Sales Persona"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Prompt Name B</label>
                            <input
                                type="text"
                                value={promptNameB}
                                onChange={(e) => setPromptNameB(e.target.value)}
                                placeholder="e.g. Standard Bot"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
