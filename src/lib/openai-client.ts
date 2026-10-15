import type { ChatMessage, Provider } from '../schemas';

/** Client minimale per endpoint compatibili OpenAI (OpenRouter, Groq, Gemini, ...). */
export function createClient({ baseUrl, apiKey }: Pick<Provider, 'baseUrl' | 'apiKey'>) {
  const base = baseUrl.trim().replace(/\/+$/, '');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey.trim()}` };

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(base + path, { ...init, headers });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
    return body as T;
  }

  return {
    async listModels(): Promise<string[]> {
      const { data } = await request<{ data: { id: string }[] }>('/models');
      return data.map(m => m.id).sort();
    },
    async chat(model: string, messages: ChatMessage[]): Promise<string> {
      const body = await request<{ choices: { message: { content: string } }[] }>('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({ model, messages: messages.map(({ role, content }) => ({ role, content })) }),
      });
      return body.choices[0].message.content;
    },
  };
}
