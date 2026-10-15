import { z } from 'zod';

// Unica fonte di verità per i tipi: gli stessi schemi validano i file importati.

export const ProviderSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  baseUrl: z.string(),
  apiKey: z.string(),
  /** Modelli salvati dall'utente, mostrati nella tendina. */
  models: z.array(z.string()),
});

export const RuleSchema = z.object({
  id: z.string().min(1),
  from: z.string(),
  to: z.string(),
});

export const ModelRefSchema = z.object({
  providerId: z.string(),
  model: z.string(),
});

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  /** Modello che ha prodotto la risposta (solo assistant). */
  model: z.string().optional(),
});

export const ChatSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  createdAt: z.number(),
  messages: z.array(ChatMessageSchema),
});

export const ConfigSchema = z.object({
  providers: z.array(ProviderSchema),
  rules: z.array(RuleSchema),
  selected: ModelRefSchema.nullable(),
});

export type Provider = z.infer<typeof ProviderSchema>;
export type Rule = z.infer<typeof RuleSchema>;
export type ModelRef = z.infer<typeof ModelRefSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type Config = z.infer<typeof ConfigSchema>;
