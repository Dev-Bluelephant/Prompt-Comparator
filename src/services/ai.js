import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mapping of providers to their available models
export const PROVIDERS = {
    OPENAI: {
        id: 'openai',
        name: 'OpenAI',
        models: [
            { id: 'o1-preview', name: 'OpenAI o1 Preview' },
            { id: 'o1-mini', name: 'OpenAI o1 Mini' },
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
        ]
    },
    ANTHROPIC: {
        id: 'anthropic',
        name: 'Anthropic',
        models: [
            { id: 'claude-opus-4-6', name: 'Claude Opus 4.6' },
            { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5' },
            { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' }
        ]
    },
    GOOGLE: {
        id: 'google',
        name: 'Google Gemini',
        models: [
            { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro' },
            { id: 'gemini-3.0-flash', name: 'Gemini 3.0 Flash' },
            { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
            { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite' }
        ]
    }
};

/**
 * Unified send message function
 * @param {string} providerId - 'openai', 'anthropic', or 'google'
 * @param {string} apiKey - API Key for the specific provider
 * @param {string} modelId - Model ID
 * @param {Array} messages - Conversation history
 * @param {string} systemPrompt - System prompt
 * @returns {Promise<Object>} - { role: 'assistant', content: '...' }
 */
export const sendMessageToAI = async (providerId, apiKey, modelId, messages, systemPrompt) => {
    if (!apiKey) throw new Error(`API Key for ${providerId} is missing.`);

    switch (providerId) {
        case 'openai':
            return await sendOpenAI(apiKey, modelId, messages, systemPrompt);
        case 'anthropic':
            return await sendAnthropic(apiKey, modelId, messages, systemPrompt);
        case 'google':
            return await sendGoogle(apiKey, modelId, messages, systemPrompt);
        default:
            throw new Error(`Unknown provider: ${providerId}`);
    }
};

const sendOpenAI = async (apiKey, model, messages, systemPrompt) => {
    const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
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
        throw new Error(errorData.error?.message || `OpenAI Error ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message;
};

const sendAnthropic = async (apiKey, model, messages, systemPrompt) => {
    // Anthropic Client using direct browser access
    const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Enable browser execution
    });

    // Convert messages to Anthropic format (system is separate)
    // And roles must strictly be user/assistant alternating (handled by hook usually, but let's ensure)
    // Anthropic API expects: { role: 'user' | 'assistant', content: string }
    // System prompt is a top-level parameter

    const formattedMessages = messages.map(m => ({
        role: m.role,
        content: m.content
    }));

    const msg = await anthropic.messages.create({
        model: model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: formattedMessages,
    });

    return { role: 'assistant', content: msg.content[0].text };
};

const sendGoogle = async (apiKey, modelId, messages, systemPrompt) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    // Gemini logic
    // History needs to be formatted: { role: 'user' | 'model', parts: [{ text: ... }] }
    // 'system' instructions are passed to getGenerativeModel (systemInstruction), but for simple
    // chat consistency, we can prepend it or use systemInstruction if supported by the model variant.
    // Gemini 1.5 supports systemInstruction.

    const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
        history: history,
        systemInstruction: systemPrompt // Requires Gemini 1.5+ generally
    });

    const result = await chat.sendMessage(lastMessage);
    const response = result.response;
    return { role: 'assistant', content: response.text() };
};
