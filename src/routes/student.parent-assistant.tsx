import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Loader2, Mic, Phone, Send, Smile, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { askMentor } from "@/lib/ai.functions";

export const Route = createFileRoute("/student/parent-assistant")({ component: ParentAssistant });

interface Msg {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const PRELOADED: Msg[] = [
  { role: "user", time: "10:23 AM", content: "नमस्ते। मेरी बेटी प्रिया Class 11 में है। उसने IT course लिया है। क्या यह सही decision है?" },
  {
    role: "assistant",
    time: "10:23 AM",
    content:
      "नमस्ते! 🙏 आपकी बेटी प्रिया ने बहुत अच्छा निर्णय लिया है।\n\nIT & ITeS एक बहुत अच्छा trade है। Uttar Pradesh में इस समय IT sector में लाखों नौकरियाँ हैं।\n\nClass 12 के बाद प्रिया को ₹12,000 – ₹18,000 प्रति माह की नौकरी मिल सकती है। 3-4 साल में ₹35,000+ तक पहुँच सकती है।\n\nक्या आप जानना चाहते हैं कि इस course में क्या पढ़ाया जाता है?",
  },
  { role: "user", time: "10:25 AM", content: "हाँ, और fees कितनी है? हम ज्यादा खर्च नहीं कर सकते।" },
  {
    role: "assistant",
    time: "10:25 AM",
    content:
      "बिल्कुल समझ सकता हूँ। 🙏\n\nअच्छी खबर यह है कि समग्र शिक्षा के तहत यह course पूरी तरह मुफ़्त है।\n\nइसके अलावा PMKVY के तहत:\n✅ Training fee: ₹0 (बिल्कुल मुफ़्त)\n✅ Certificate: NSQF Level 3 (सरकारी मान्यता प्राप्त)\n✅ Placement support: Wipro, TCS जैसी companies में interview",
  },
  { role: "user", time: "10:28 AM", content: "Certificate के बाद नौकरी पक्की है क्या? और लड़कियों के लिए safe है?" },
  {
    role: "assistant",
    time: "10:29 AM",
    content:
      "बहुत जरूरी सवाल है — बिल्कुल सही पूछा।\n\nनौकरी: Varanasi और Lucknow में अभी 2,400+ IT jobs खाली हैं। NSQF Level 3 certificate वाले candidates को priority मिलती है।\n\nSafety: IT jobs mostly office-based हैं — AC office, 9-6 hours, weekends off। Wipro और TCS में dedicated women safety policies हैं। Noida और Lucknow में female-friendly offices हैं।\n\nGovernment का Women in Tech programme भी extra support देता है। 👩‍💻",
  },
  { role: "user", time: "10:31 AM", content: "ठीक है। प्रिया अभी कितना पढ़ चुकी है? कैसी progress है?" },
  {
    role: "assistant",
    time: "10:31 AM",
    content:
      "प्रिया की progress बहुत अच्छी है! 😊\n\n📊 Course: IT & ITeS Fundamentals\n✅ 8 में से 8 modules complete — 68% पूरा\n⭐ Last assessment score: 88%\n🔥 Study streak: 12 days लगातार\n\nइस हफ्ते उन्होंने HTML & CSS सीखा। आज उनकी live class भी है — 3:00 PM पर।\n\nक्या आप हर हफ्ते WhatsApp पर progress report लेना चाहेंगे?",
  },
];

const QUICK = ["Fees कितनी है?", "Jobs कहाँ मिलेंगी?", "Salary कितनी होगी?", "Certificate valid है?", "Progress कैसी है?"];

function nowTime() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

function ParentAssistant() {
  const ask = useServerFn(askMentor);
  const [msgs, setMsgs] = useState<Msg[]>(PRELOADED);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Msg = { role: "user", content: trimmed, time: nowTime() };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({
        data: {
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          persona: "parent",
        },
      });
      setMsgs((prev) => [
        ...prev,
        {
          role: "assistant",
          time: nowTime(),
          content: res.error ? "क्षमा करें, कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।" : res.reply,
        },
      ]);
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", time: nowTime(), content: "क्षमा करें, कनेक्शन में समस्या है।" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        {/* WhatsApp header */}
        <div className="flex items-center gap-2 px-3 py-2.5 text-white" style={{ background: "#075E54" }}>
          <ArrowLeft className="h-4 w-4" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 font-semibold">V</div>
          <div className="flex-1 leading-tight">
            <div className="text-[14px] font-medium">VocAI Guru — Parent Helpline</div>
            <div className="text-[10.5px] text-emerald-100">Samagra Shiksha · हिंदी सहायता</div>
          </div>
          <Video className="h-4 w-4" />
          <Phone className="h-4 w-4" />
        </div>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="flex h-[440px] flex-col gap-1.5 overflow-y-auto px-3 py-3"
          style={{ background: "#ECE5DD" }}
        >
          <div className="mx-auto mb-1 rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] text-gray-600">आज</div>
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] rounded-lg px-2.5 py-1.5 text-[12.5px] leading-snug shadow-sm ${
                  m.role === "user" ? "bg-[#DCF8C6] text-gray-900" : "bg-white text-gray-900"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className="mt-0.5 text-right text-[9.5px] text-gray-500">
                  {m.time} {m.role === "user" && "✓✓"}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <Loader2 className="h-3 w-3 animate-spin" /> typing...
            </div>
          )}
        </div>

        {/* Quick chips */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-gray-100 bg-gray-50 px-2 py-1.5">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={loading}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-1.5 border-t border-gray-100 bg-white px-2 py-2"
        >
          <Smile className="h-5 w-5 shrink-0 text-gray-400" />
          <div className="flex flex-1 items-center gap-1 rounded-full bg-gray-100 px-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="हिंदी में message लिखें..."
              className="flex-1 bg-transparent py-1.5 text-[13px] focus:outline-none disabled:opacity-50"
            />
            <Mic className="h-4 w-4 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-50"
            style={{ background: "#075E54" }}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="mt-2 rounded-md bg-gray-100 px-3 py-1.5 text-center text-[11px] text-gray-600">
        यह chatbot WhatsApp पर भी उपलब्ध है: +91 98765 43210
      </div>
    </div>
  );
}
