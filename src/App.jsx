import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import ChatInterface from './components/Chat/ChatInterface';
import SettingsModal from './components/Settings/SettingsModal';
import useChat from './hooks/useChat';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    systemPromptA: 'You are a helpful assistant.',
    systemPromptB: 'You are a sarcastic assistant.'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('prompt-comparator-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    } else {
      setIsSettingsOpen(true);
    }
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('prompt-comparator-settings', JSON.stringify(newSettings));
  };

  const chatA = useChat();
  const chatB = useChat();

  const handleSendMessage = (content) => {
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    chatA.sendMessage(content, settings.apiKey, settings.model, settings.systemPromptA);
    chatB.sendMessage(content, settings.apiKey, settings.model, settings.systemPromptB);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      chatA.clearChat();
      chatB.clearChat();
    }
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      settings: testSettingsWithoutKey(settings),
      conversations: {
        promptA: {
          systemPrompt: settings.systemPromptA,
          messages: chatA.messages
        },
        promptB: {
          systemPrompt: settings.systemPromptB,
          messages: chatB.messages
        }
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-comparison-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to remove API key from export
  const testSettingsWithoutKey = (s) => {
    const { apiKey, ...rest } = s;
    return rest;
  };

  const hasMessages = chatA.messages.length > 0 || chatB.messages.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClear={handleClear}
        onExport={handleExport}
        hasMessages={hasMessages}
      />

      <ChatInterface
        messagesA={chatA.messages}
        messagesB={chatB.messages}
        isLoadingA={chatA.isLoading}
        isLoadingB={chatB.isLoading}
        onSendMessage={handleSendMessage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={saveSettings}
        initialSettings={settings}
      />
    </div>
  );
}

export default App;
