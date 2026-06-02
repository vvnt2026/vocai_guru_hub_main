import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mic, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { askMentor } from "@/lib/ai.functions";

export const Route = createFileRoute("/student/hindi-mentor")({ component: HindiMentor });

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME =
  "नमस्ते प्रिया! मैं आपकी AI सहायक हूँ — IT & ITeS trade के लिए, समग्र शिक्षा के अंतर्गत।\n\nआप मुझसे ये सब पूछ सकती हैं:\n• IT course की पूरी जानकारी\n• Uttar Pradesh में नौकरी और salary\n• PMKVY, Skill India, NSDC की योजनाएं\n• NSQF Level 3 certificate कैसे मिलेगा\n• Career में आगे कैसे बढ़ें\n\nआज क्या जानना है? 😊";

const PRELOADED: Msg[] = [
  { role: "assistant", content: WELCOME },
  { role: "user", content: "मुझे IT trade में कितनी salary मिलेगी UP में?" },
  {
    role: "assistant",
    content:
      "बहुत अच्छा सवाल, प्रिया! Uttar Pradesh में IT & ITeS trade में salary इस तरह होती है:\n\nशुरुआत में (0-1 साल): ₹12,000 – ₹18,000 प्रति माह\nData Entry / IT Support जैसे jobs में।\n\n1-3 साल के बाद: ₹20,000 – ₹35,000 प्रति माह\nJunior Developer या Network Technician बन सकती हैं।\n\n5 साल के बाद: ₹50,000+ प्रति माह\n\nLucknow और Noida में Wipro, TCS, और HCL जैसी companies actively NSQF certified candidates hire करती हैं। PMKVY के तहत free training और placement support भी मिलेगा।\n\nक्या आप जानना चाहेंगी कि PMKVY में apply कैसे करें? 🎯",
  },
];

const QUICK_HI = [
  "PMKVY में apply कैसे करें?",
  "UP में नौकरी कहाँ मिलेगी?",
  "NSQF certificate कैसे मिलेगा?",
  "कौन सी company hire करती है?",
];
const QUICK_EN = [
  "How to apply for PMKVY?",
  "Where will I get a job in UP?",
  "How to get NSQF certificate?",
  "Which companies hire freshers?",
];

function HindiMentor() {
  const ask = useServerFn(askMentor);
  const [uiLang, setUiLang] = useState<"hi" | "en">("hi");
  const [msgs, setMsgs] = useState<Msg[]>(PRELOADED);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const res = await ask({ data: { messages: next, persona: "hindi-mentor" } });
      setMsgs([
        ...next,
        {
          role: "assistant",
          content: res.error
            ? `क्षमा करें, कनेक्शन में समस्या है (${res.error}). कृपया दोबारा कोशिश करें।`
            : res.reply,
        },
      ]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "क्षमा करें, कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।" }]);
    } finally {
      setLoading(false);
    }
  };

  const quick = useMemo(() => (uiLang === "hi" ? QUICK_HI : QUICK_EN), [uiLang]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3.5 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-base">🇮🇳</div>
        <div className="flex-1 leading-tight">
          <div className="text-[13px] font-medium">AI हिंदी सहायक · IT & ITeS</div>
          <div className="text-[10px] text-gray-500">AI द्वारा संचालित · हमेशा उपलब्ध</div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white p-0.5">
          <button
            onClick={() => setUiLang("hi")}
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition ${uiLang === "hi" ? "border-2 border-orange-500 bg-orange-50 text-orange-700" : "text-gray-500"}`}
          >
            हिं
          </button>
          <button
            onClick={() => setUiLang("en")}
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition ${uiLang === "en" ? "bg-gray-100 text-gray-700" : "text-gray-500"}`}
          >
            EN
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-emerald-600">लाइव</span>
        </div>
      </div>

      {/* Chat */}
      <div ref={scrollRef} className="flex max-h-[360px] min-h-[300px] flex-col gap-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <span className="mb-0.5 text-[10px] text-gray-400">{m.role === "user" ? "आप" : "AI सहायक"}</span>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-xl border px-3 py-2 text-[12.5px] leading-[1.65] ${m.role === "user" ? "border-blue-300 bg-blue-50 text-blue-900" : "border-gray-200 bg-gray-50 text-gray-800"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> सोच रही हूँ...
          </div>
        )}
      </div>

      {/* Voice + status */}
      <div className="flex items-center gap-3 rounded-lg border border-orange-100 bg-orange-50/50 px-3 py-2.5">
        <button
          onClick={() => {
            setListening((v) => !v);
            setTimeout(() => setListening(false), 2200);
          }}
          className={`relative flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition hover:bg-orange-200 ${listening ? "ring-4 ring-orange-300 ring-offset-1" : ""}`}
        >
          <Mic className="h-5 w-5" />
          {listening && <span className="absolute inset-0 animate-ping rounded-full bg-orange-300/40" />}
        </button>
        <div className="flex-1 text-[12px] italic text-gray-500">
          {listening ? <span className="font-medium not-italic text-emerald-600">सुन रहा हूँ...</span> : "माइक बटन दबाकर हिंदी में बोलें..."}
        </div>
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-1.5">
        {quick.map((s) => (
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

      {/* Input */}
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
          placeholder="हिंदी या English में टाइप करें..."
          className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-orange-300 disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center justify-center rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-3 text-white shadow-sm hover:from-emerald-700 hover:to-green-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
