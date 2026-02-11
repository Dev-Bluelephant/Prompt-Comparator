import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import ChatInterface from './components/Chat/ChatInterface';
import SettingsModal from './components/Settings/SettingsModal';
import useChat from './hooks/useChat';
import { PROVIDERS } from './services/ai';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('prompt_comparator_settings');
    return saved ? JSON.parse(saved) : {
      apiKey: '',
      anthropicKey: '',
      googleKey: '',
      systemPromptA: 'You are a helpful assistant.',
      systemPromptB: 'You are a helpful assistant.'
    };
  });

  // Independent configurations for each side
  const [configA, setConfigA] = useState({ provider: 'OPENAI', model: PROVIDERS.OPENAI.models[0].id });
  const [configB, setConfigB] = useState({ provider: 'OPENAI', model: PROVIDERS.OPENAI.models[0].id });

  const chatA = useChat();
  const chatB = useChat();

  useEffect(() => {
    localStorage.setItem('prompt_comparator_settings', JSON.stringify(settings));
  }, [settings]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const getApiKeyForProvider = (provider) => {
    switch (provider) {
      case 'OPENAI': return settings.apiKey;
      case 'ANTHROPIC': return settings.anthropicKey;
      case 'GOOGLE': return settings.googleKey;
      default: return '';
    }
  };

  const handleSendMessage = (content) => {
    const keyA = getApiKeyForProvider(configA.provider);
    const keyB = getApiKeyForProvider(configB.provider);

    chatA.sendMessage(content, configA.provider, keyA, configA.model, settings.systemPromptA);
    chatB.sendMessage(content, configB.provider, keyB, configB.model, settings.systemPromptB);
  };

  const handleClear = () => {
    chatA.clearChat();
    chatB.clearChat();
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      configA: { ...configA, systemPrompt: settings.systemPromptA },
      configB: { ...configB, systemPrompt: settings.systemPromptB },
      chatHistoryA: chatA.messages,
      chatHistoryB: chatB.messages
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClear={handleClear}
        onExport={handleExport}
      />

      <ChatInterface
        messagesA={chatA.messages}
        messagesB={chatB.messages}
        isLoadingA={chatA.isLoading}
        isLoadingB={chatB.isLoading}
        onSendMessage={handleSendMessage}
        configA={configA}
        configB={configB}
        onConfigAChange={setConfigA}
        onConfigBChange={setConfigB}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        initialSettings={settings}
      />
    </div>
  );
}

export default App;
