// Server-only helper (Mocked).
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callLovableAI(opts: {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  responseFormat?: any;
}): Promise<string> {
  // Simulate network delay to feel natural
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return a generic static response for other features that still call this
  return "This is a static response. The AI API has been completely disabled.";
}
