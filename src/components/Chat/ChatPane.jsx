import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const ChatPane = ({ messages, promptVariant, isLoading }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-primary)',
            borderRight: promptVariant === 'A' ? '1px solid var(--border-color)' : 'none'
        }}>


            <div style={{ flex: 1 }}>
                {messages.length === 0 ? (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-tertiary)',
                        fontStyle: 'italic'
                    }}>
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble
                            key={index}
                            role={msg.role}
                            content={msg.content}
                            promptVariant={promptVariant}
                        />
                    ))
                )}
                {isLoading && (
                    <div style={{ padding: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        Generating response...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default ChatPane;
