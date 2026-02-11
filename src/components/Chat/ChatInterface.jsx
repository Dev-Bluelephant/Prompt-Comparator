import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ChatPane from './ChatPane';

const ChatInterface = ({ messagesA, messagesB, isLoadingA, isLoadingB, onSendMessage }) => {
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
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)' }}> {/* Adjust 70px for header height */}

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
                        placeholder="Type your message to both prompts..."
                        rows={1} // You might want a dynamic text area here, but keeping simple for now
                        style={{
                            width: '100%',
                            padding: '1rem 3.5rem 1rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            resize: 'none',
                            boxShadow: 'var(--shadow-sm)',
                            minHeight: '56px', // Ensure enough height
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
                <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Both models will receive your message simultaneously.
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
