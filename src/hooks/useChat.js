import { useState, useCallback } from 'react';
import { sendMessageToAI } from '../services/ai';

const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (content, providerId, apiKey, modelId, systemPrompt) => {
        if (!apiKey) {
            setError(`API Key for ${providerId} is missing`);
            // Add a visual error message to the chat as well
            setMessages(prev => [...prev, {
                role: 'user',
                content
            }, {
                role: 'assistant',
                content: `Error: API Key for ${providerId} is missing. Please check Settings.`
            }]);
            return;
        }

        setIsLoading(true);
        setError(null);

        // Add user message immediately
        const userMsg = { role: 'user', content };
        setMessages(prev => [...prev, userMsg]);

        try {
            const assistantMsg = await sendMessageToAI(providerId.toLowerCase(), apiKey, modelId, messages, systemPrompt);
            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error('Chat Error:', err);
            setError(err.message);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${err.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat
    };
};

export default useChat;
