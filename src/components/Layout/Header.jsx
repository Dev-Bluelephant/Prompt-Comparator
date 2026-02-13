import React from 'react';
import { Settings, Trash2, Download } from 'lucide-react';

const Header = ({ onOpenSettings, onClear, onExport, hasMessages }) => {
    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-secondary)',
        transition: 'var(--transition-fast)',
        fontSize: '0.875rem'
    };

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    margin: 0,
                    background: 'linear-gradient(to right, var(--accent-prompt-a), var(--accent-prompt-b))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Prompt Comparator
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                {hasMessages && (
                    <button
                        onClick={onClear}
                        style={{ ...buttonStyle, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        title="Clear Chat"
                    >
                        <Trash2 size={18} />
                        <span>Clear</span>
                    </button>
                )}
                <button
                    onClick={onExport}
                    style={buttonStyle}
                    title="Download Excel Dataset"
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <Download size={18} />
                    <span>Export Excel</span>
                </button>

                <button
                    onClick={onOpenSettings}
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
