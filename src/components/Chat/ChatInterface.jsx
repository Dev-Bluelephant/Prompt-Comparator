import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ChatPane from './ChatPane';
import { PROVIDERS } from '../../services/ai';

const ModelSelector = ({ config, onConfigChange, side, availableModels }) => {
    const accentColor = side === 'A' ? 'var(--accent-prompt-a)' : 'var(--accent-prompt-b)';
    const models = availableModels[config.provider]?.models || [];

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
        }}>
            <select
                value={config.provider}
                onChange={(e) => onConfigChange({ ...config, provider: e.target.value, model: availableModels[e.target.value].models[0].id })}
                style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: accentColor,
                    fontWeight: 600,
                    padding: '0.25rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    outline: 'none'
                }}
            >
                {Object.values(availableModels).map(p => (
                    <option key={p.id} value={p.name.toUpperCase() === 'OPENAI' ? 'OPENAI' : p.name.toUpperCase() === 'ANTHROPIC' ? 'ANTHROPIC' : 'GOOGLE'}>
                        {p.name}
                    </option>
                ))}
            </select>

            <select
                value={config.model}
                onChange={(e) => onConfigChange({ ...config, model: e.target.value })}
                style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    flex: 1,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    outline: 'none'
                }}
            >
                {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
        </div>
    );
};

const ChatInput = ({ onSend, isLoading, placeholder }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)'
        }}>
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    style={{
                        width: '100%',
                        padding: '0.75rem 3rem 0.75rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        resize: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        minHeight: '46px',
                        maxHeight: '150px'
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '0.4rem',
                        borderRadius: '50%',
                        backgroundColor: (!input.trim() || isLoading) ? 'transparent' : 'var(--accent-primary)',
                        color: (!input.trim() || isLoading) ? 'var(--text-tertiary)' : 'white',
                        transition: 'var(--transition-fast)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </form>
        </div>
    );
};

const ChatInterface = ({
    messagesA,
    messagesB,
    isLoadingA,
    isLoadingB,
    onSendMessageA,
    onSendMessageB,
    configA,
    configB,
    onConfigAChange,
    onConfigBChange,
    availableModels = PROVIDERS
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)' }}>

            {/* Split View Container */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Side A */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)' }}>
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                        <ModelSelector config={configA} onConfigChange={onConfigAChange} side="A" availableModels={availableModels} />
                    </div>
                    <ChatPane messages={messagesA} promptVariant="A" isLoading={isLoadingA} />
                    <ChatInput onSend={onSendMessageA} isLoading={isLoadingA} placeholder="Message Model A..." />
                </div>

                {/* Side B */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                        <ModelSelector config={configB} onConfigChange={onConfigBChange} side="B" availableModels={availableModels} />
                    </div>
                    <ChatPane messages={messagesB} promptVariant="B" isLoading={isLoadingB} />
                    <ChatInput onSend={onSendMessageB} isLoading={isLoadingB} placeholder="Message Model B..." />
                </div>

            </div>
        </div>
    );
};

export default ChatInterface;
