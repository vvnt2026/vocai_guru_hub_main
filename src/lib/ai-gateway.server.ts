// Server-only helper for Groq AI via fetch (OpenAI compatible endpoint).
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama3-8b-8192"; // Lighter model, used on rate limit retry

async function groqFetch(key: string, model: string, opts: {
  messages: ChatMessage[];
  maxTokens?: number;
  responseFormat?: any;
}): Promise<Response> {
  return fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 800,
      ...(opts.responseFormat && { response_format: opts.responseFormat }),
    }),
  });
}

export async function callLovableAI(opts: {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  responseFormat?: any;
}): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Missing GROQ_API_KEY");

  const model = opts.model ?? PRIMARY_MODEL;

  // First attempt
  let res = await groqFetch(key, model, opts);

  // On rate limit (429): wait 3s and retry with lighter fallback model
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 3000));
    res = await groqFetch(key, FALLBACK_MODEL, opts);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI is busy right now. Please wait a moment and try again.");
    throw new Error(`Groq API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}
