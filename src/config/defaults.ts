import type { Provider } from '../schemas';

/** Provider con tier gratuito ed endpoint compatibile OpenAI. Valori iniziali: l'utente li modifica dalle impostazioni. */
export const DEFAULT_PROVIDERS: Provider[] = [
  { id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', apiKey: '', models: [] },
  { id: 'groq', name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', apiKey: '', models: [] },
  { id: 'gemini', name: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', apiKey: '', models: [] },
];
