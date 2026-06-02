// Server-only helper for Google Gemini AI via fetch (OpenAI compatible endpoint).
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callLovableAI(opts: {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "gemini-1.5-flash",
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 800,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}
