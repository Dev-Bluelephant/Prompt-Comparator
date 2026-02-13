import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import ChatInterface from './components/Chat/ChatInterface';
import SettingsModal from './components/Settings/SettingsModal';
import useChat from './hooks/useChat';
import { PROVIDERS, fetchAvailableModels } from './services/ai';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('prompt_comparator_settings');
    return saved ? JSON.parse(saved) : {
      apiKey: '',
      anthropicKey: '',
      googleKey: '',
      systemPromptA: 'You are a helpful assistant.',
      systemPromptB: 'You are a helpful assistant.',
      promptNameA: 'Prompt A',
      promptNameB: 'Prompt B'
    };
  });

  // Independent configurations for each side
  const [configA, setConfigA] = useState({ provider: 'OPENAI', model: PROVIDERS.OPENAI.models[0].id });
  const [configB, setConfigB] = useState({ provider: 'OPENAI', model: PROVIDERS.OPENAI.models[0].id });

  // Dynamic models state
  const [availableModels, setAvailableModels] = useState(PROVIDERS);

  const chatA = useChat();
  const chatB = useChat();

  useEffect(() => {
    localStorage.setItem('prompt_comparator_settings', JSON.stringify(settings));
    refreshModels();
  }, [settings]);

  // Initial fetch on mount
  useEffect(() => {
    refreshModels();
  }, []);

  const refreshModels = async () => {
    const newModels = { ...PROVIDERS };

    // Fetch OpenAI
    if (settings.apiKey) {
      const models = await fetchAvailableModels('openai', settings.apiKey);
      if (models.length > 0) newModels.OPENAI.models = models;
    }

    // Fetch Anthropic
    if (settings.anthropicKey) {
      const models = await fetchAvailableModels('anthropic', settings.anthropicKey);
      if (models.length > 0) newModels.ANTHROPIC.models = models;
    }

    // Fetch Google
    if (settings.googleKey) {
      const models = await fetchAvailableModels('google', settings.googleKey);
      if (models.length > 0) newModels.GOOGLE.models = models;
    }

    setAvailableModels(newModels);
  };

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

  const handleSendMessageA = (content) => {
    const key = getApiKeyForProvider(configA.provider);
    chatA.sendMessage(content, configA.provider, key, configA.model, settings.systemPromptA);
  };

  const handleSendMessageB = (content) => {
    const key = getApiKeyForProvider(configB.provider);
    chatB.sendMessage(content, configB.provider, key, configB.model, settings.systemPromptB);
  };

  const handleClear = () => {
    chatA.clearChat();
    chatB.clearChat();
  };

  const handleExport = async () => {
    // Dynamic import to avoid loading heavy libraries on initial page load
    const ExcelJS = await import('exceljs');
    const { saveAs } = await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Comparison');

    // Define Columns
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'User Message', key: 'user', width: 40 },
      { header: `${settings.promptNameA} (Response)`, key: 'respA', width: 40 },
      { header: `${settings.promptNameB} (Response)`, key: 'respB', width: 40 },
    ];

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2D3748' } // Dark gray background
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    const historyA = chatA.messages;
    const historyB = chatB.messages;
    const maxLength = Math.max(historyA.length, historyB.length);

    for (let i = 0; i < maxLength; i++) {
      const msgA = historyA[i];
      const msgB = historyB[i];

      // Identify User Content (Shared)
      let userContent = '';
      if (msgA?.role === 'user') userContent = msgA.content;
      else if (msgB?.role === 'user') userContent = msgB.content;

      if (userContent) {
        const nextA = historyA[i + 1];
        const nextB = historyB[i + 1];

        let respA = (nextA?.role === 'assistant') ? nextA.content : '';
        let respB = (nextB?.role === 'assistant') ? nextB.content : '';

        const row = worksheet.addRow({
          date: new Date().toISOString().slice(0, 10),
          user: userContent,
          respA: respA,
          respB: respB
        });

        // Apply Styles to Cells

        // User Cell (Cyan/Blueish)
        const userCell = row.getCell('user');
        userCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFBBDEFB' } // Light Blue (simulating Cyan)
        };
        userCell.alignment = { wrapText: true, vertical: 'top' };

        // Response A Cell (Green)
        const cellA = row.getCell('respA');
        cellA.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC8E6C9' } // Light Green
        };
        cellA.alignment = { wrapText: true, vertical: 'top' };

        // Response B Cell (Purple)
        const cellB = row.getCell('respB');
        cellB.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE1BEE7' } // Light Purple
        };
        cellB.alignment = { wrapText: true, vertical: 'top' };

        // Date Alignment
        row.getCell('date').alignment = { vertical: 'top' };
      }
    }

    // Write buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `dataset_${settings.promptNameA}_vs_${settings.promptNameB}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClear={handleClear}
        onExport={handleExport}
        hasMessages={chatA.messages.length > 0 || chatB.messages.length > 0}
      />

      <ChatInterface
        messagesA={chatA.messages}
        messagesB={chatB.messages}
        isLoadingA={chatA.isLoading}
        isLoadingB={chatB.isLoading}
        onSendMessageA={handleSendMessageA}
        onSendMessageB={handleSendMessageB}
        configA={configA}
        configB={configB}
        onConfigAChange={setConfigA}
        onConfigBChange={setConfigB}
        availableModels={availableModels}
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
