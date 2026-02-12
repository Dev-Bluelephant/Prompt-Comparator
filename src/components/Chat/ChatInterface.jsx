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

const ChatInterface = ({
    messagesA,
    messagesB,
    isLoadingA,
    isLoadingB,
    onSendMessage,
    configA,
    configB,
    onConfigAChange,
    onConfigBChange,
    availableModels = PROVIDERS // Default fallback
}) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoadingA || isLoadingB) return;

        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)' }}>

            {/* Configuration Bar */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)'
            }}>
                <div style={{ flex: 1, padding: '0.5rem 1rem', borderRight: '1px solid var(--border-color)' }}>
                    <ModelSelector config={configA} onConfigChange={onConfigAChange} side="A" availableModels={availableModels} />
                </div>
                <div style={{ flex: 1, padding: '0.5rem 1rem' }}>
                    <ModelSelector config={configB} onConfigChange={onConfigBChange} side="B" availableModels={availableModels} />
                </div>
            </div>

            {/* Split View Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <ChatPane messages={messagesA} promptVariant="A" isLoading={isLoadingA} />
                <ChatPane messages={messagesB} promptVariant="B" isLoading={isLoadingB} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)'
            }}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        position: 'relative'
                    }}
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message to both models..."
                        rows={1}
                        style={{
                            width: '100%',
                            padding: '1rem 3.5rem 1rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            resize: 'none',
                            boxShadow: 'var(--shadow-sm)',
                            minHeight: '56px',
                            maxHeight: '200px'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoadingA || isLoadingB}
                        style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            backgroundColor: (!input.trim() || isLoadingA || isLoadingB) ? 'transparent' : 'var(--accent-primary)',
                            color: (!input.trim() || isLoadingA || isLoadingB) ? 'var(--text-tertiary)' : 'white',
                            transition: 'var(--transition-fast)'
                        }}
                    >
                        {(isLoadingA || isLoadingB) ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
