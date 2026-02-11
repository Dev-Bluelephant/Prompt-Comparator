import { useState, useCallback } from 'react';

const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (content, apiKey, model, systemPrompt) => {
        if (!apiKey) {
            setError('API Key is missing');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Add user message immediately
        const userMsg = { role: 'user', content };

        // Optimistically update messages
        setMessages(prev => [...prev, userMsg]);

        try {
            // Prepare messages for API including system prompt at start
            // We need to reconstruct the full history for the API call
            // The `messages` state in this hook tracks the visible conversation
            // We should prepend the system prompt for the API call

            const apiMessages = [
                { role: 'system', content: systemPrompt },
                ...messages,
                userMsg
            ];

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: apiMessages,
                    temperature: 0.7,
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Error ${response.status}`);
            }

            const data = await response.json();
            const assistantMsg = data.choices[0].message;

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error('Chat Error:', err);
            setError(err.message);
            // Optional: Add an error message to the chat
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${err.message}. Please check your API Key and settings.`
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
