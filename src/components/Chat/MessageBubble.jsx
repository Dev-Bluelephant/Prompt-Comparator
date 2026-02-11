import React from 'react';
import { User, Sparkles } from 'lucide-react';

const MessageBubble = ({ role, content, promptVariant }) => {
    const isUser = role === 'user';

    // Choose accent color based on prompt variant (A or B)
    const botColor = promptVariant === 'A' ? 'var(--accent-prompt-a)' : 'var(--accent-prompt-b)';

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: isUser ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid var(--border-color)',
        }}>
            <div style={{
                flexShrink: 0,
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isUser ? 'var(--bg-tertiary)' : botColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isUser ? 'var(--text-primary)' : '#fff'
            }}>
                {isUser ? <User size={16} /> : <Sparkles size={16} />}
            </div>
            <div style={{ flex: 1, lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem', color: isUser ? 'var(--text-secondary)' : botColor }}>
                    {isUser ? 'You' : `Prompt ${promptVariant}`}
                </span>
                {content}
            </div>
        </div>
    );
};

export default MessageBubble;
