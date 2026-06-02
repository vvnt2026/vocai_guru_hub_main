import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { askMentor } from "@/lib/ai.functions";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/student/ai-mentor")({ component: Mentor });

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS_EN = [
  "What government schemes will help me?",
  "Which companies will hire me in UP?",
  "Tell me about PMKVY",
  "How to get NSQF certified?",
];
const SUGGESTIONS_HI = [
  "कौन सी सरकारी योजनाएँ मेरी मदद करेंगी?",
  "UP में कौन सी कंपनियाँ मुझे नौकरी देंगी?",
  "PMKVY के बारे में बताइए",
  "NSQF प्रमाणित कैसे बनें?",
];

const WELCOME_EN =
  "Namaste Priya! I'm your AI Mentor for IT & ITeS under Samagra Shiksha.\n\nYou've got a great match for this trade! I can help you with:\n• Course content and clearing doubts\n• Career paths in IT in Uttar Pradesh\n• NSQF Level 3 certification pathway\n• Government schemes: PMKVY, Skill India, NSDC\n• Salary and job market insights\n\nWhat would you like to know?";

const WELCOME_HI =
  "नमस्ते प्रिया! मैं समग्र शिक्षा के तहत IT व ITeS के लिए आपकी AI मेंटर हूँ।\n\nयह ट्रेड आपके लिए बहुत उपयुक्त है! मैं इनमें मदद कर सकती हूँ:\n• कोर्स सामग्री व शंका समाधान\n• उत्तर प्रदेश में IT करियर के रास्ते\n• NSQF स्तर 3 प्रमाणन का मार्ग\n• सरकारी योजनाएँ: PMKVY, Skill India, NSDC\n• वेतन व नौकरी बाज़ार की जानकारी\n\nआप क्या जानना चाहेंगी?";

function Mentor() {
  const ask = useServerFn(askMentor);
  const { lang, t } = useLang();
  const welcome = useMemo(() => (lang === "hi" ? WELCOME_HI : WELCOME_EN), [lang]);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset welcome when language changes (if only the welcome is shown)
  useEffect(() => {
    setMsgs((prev) =>
      prev.length === 1 && prev[0].role === "assistant"
        ? [{ role: "assistant", content: welcome }]
        : prev,
    );
  }, [welcome]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...msgs, { role: "user", content: trimmed }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({ data: { messages: next, lang } });
      setMsgs([
        ...next,
        {
          role: "assistant",
          content: res.error
            ? t(`Connection issue: ${res.error}. Please try again.`, `कनेक्शन समस्या: ${res.error}. कृपया पुनः प्रयास करें।`)
            : res.reply,
        },
      ]);
    } catch {
      setMsgs([
        ...next,
        { role: "assistant", content: t("Connection issue. Please try again.", "कनेक्शन समस्या। कृपया पुनः प्रयास करें।") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = lang === "hi" ? SUGGESTIONS_HI : SUGGESTIONS_EN;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      <div className="flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-3.5 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 leading-tight">
          <div className="text-[12px] font-medium">{t("AI Mentor · IT & ITeS", "AI मेंटर · IT व ITeS")}</div>
          <div className="text-[10px] text-gray-500">
            {t("Powered by AI · Always available", "AI द्वारा · सदा उपलब्ध")}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-emerald-600">{t("Live", "लाइव")}</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex max-h-[420px] min-h-[340px] flex-col gap-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3"
      >
        {msgs.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <span className="mb-0.5 text-[10px] text-gray-400">
              {m.role === "user" ? t("You", "आप") : t("AI Mentor", "AI मेंटर")}
            </span>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-xl border px-3 py-2 text-[12px] leading-[1.65] ${
                m.role === "user"
                  ? "border-blue-300 bg-blue-50 text-blue-900"
                  : "border-gray-200 bg-gray-50 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("Thinking...", "सोच रही हूँ...")}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-1.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder={t("Ask your AI mentor anything...", "अपनी AI मेंटर से कुछ भी पूछें...")}
          className="flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center justify-center rounded-md border border-gray-200 bg-blue-50 px-3 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
        >
          <Send className="h-[15px] w-[15px]" />
        </button>
      </form>
    </div>
  );
}
