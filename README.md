# Prompt Comparator

A powerful tool to compare AI System Prompts side-by-side using multiple providers (OpenAI, Anthropic, Gemini).

## Features
-   **Multi-Model Support**: Compare OpenAI vs Anthropic, or Gemini vs OpenAI.
    -   **OpenAI**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
    -   **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
    -   **Google**: Gemini 1.5 Pro, Gemini 1.5 Flash
-   **Dual Chat**: Independent configuration for left and right panes.
-   **Privacy**: API Keys are stored only in your browser (LocalStorage).
-   **Export**: Download chat datasets as JSON.
- **Responsive**: Works on desktop and mobile.

## How to use
1. Go to the [Live Demo](https://dev-bluelephant.github.io/Prompt-Comparator/).
2. Click **Settings** (top right).
3. Enter your OpenAI API Key.
4. Set two different System Prompts (e.g., "You offer concise advice" vs "You explain things like to a 5 year old").
5. Start chatting!

## Running Locally
1. Clone the repo.
2. `npm install`
3. `npm run dev`

## Deployment
This project is configured to deploy automatically to GitHub Pages via GitHub Actions.
