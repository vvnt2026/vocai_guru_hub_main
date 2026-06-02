import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Award, CheckCircle2, Languages, MessageSquare, Send, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Badge, Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/teacher/communications")({ component: Communications });

interface Draft {
  id: string;
  type: "alert" | "achievement";
  student: string;
  parent: string;
  phone: string;
  en: string;
  hi: string;
  sent: boolean;
}

const DRAFTS_SEED: Draft[] = [
  {
    id: "d1",
    type: "alert",
    student: "Vikram Yadav",
    parent: "Mr. Ramesh Yadav",
    phone: "+91 98XXXX 4521",
    en: "Namaste Mr. Yadav. Vikram has missed 3 classes this week and his last assignment scored 41/100. We are concerned about his progress. Please call the teacher between 4–5pm today. Together we can help him succeed.",
    hi: "नमस्ते रमेश जी। विक्रम ने इस सप्ताह 3 कक्षाएँ छोड़ी हैं और उसके पिछले असाइनमेंट में 41/100 अंक आए हैं। हमें उसकी प्रगति को लेकर चिंता है। कृपया आज शाम 4–5 बजे शिक्षक से बात करें। मिलकर हम उसे सफल बना सकते हैं।",
    sent: false,
  },
  {
    id: "d2",
    type: "achievement",
    student: "Ananya Singh",
    parent: "Mrs. Kavita Singh",
    phone: "+91 98XXXX 7842",
    en: "Congratulations! Ananya scored 92/100 in the IT Web Development practical — top 5% in the district. Her project was selected for the state-level showcase. Wipro & TCS recruit from this program. We are proud of her hard work.",
    hi: "बधाई हो! अनन्या ने IT वेब डेवलपमेंट प्रैक्टिकल में 92/100 अंक प्राप्त किए — जिले के टॉप 5% में। उसका प्रोजेक्ट राज्य-स्तरीय प्रदर्शनी के लिए चयनित हुआ है। Wipro और TCS इस कार्यक्रम से भर्ती करते हैं। उसकी मेहनत पर हमें गर्व है।",
    sent: false,
  },
  {
    id: "d3",
    type: "alert",
    student: "Rohan Verma",
    parent: "Mr. Sanjay Verma",
    phone: "+91 98XXXX 1198",
    en: "Namaste Sanjay ji. Rohan's quiz scores have dropped from 78% to 52% in two weeks. He seems distracted during live classes. Please discuss study time at home and contact the teacher if there are any issues.",
    hi: "नमस्ते संजय जी। रोहन के क्विज़ स्कोर 78% से घटकर 52% हो गए हैं। वह लाइव कक्षाओं में ध्यान नहीं दे रहा। कृपया घर पर पढ़ाई के समय पर चर्चा करें और कोई समस्या हो तो शिक्षक से संपर्क करें।",
    sent: false,
  },
];

function Communications() {
  const [drafts, setDrafts] = useState(DRAFTS_SEED);
  const [tab, setTab] = useState<"drafts" | "bulk">("drafts");
  const [bulk, setBulk] = useState({
    en: "Reminder: Tomorrow's IT Web Development class will start at 10am sharp. Please ensure your child is online 5 minutes early.",
    hi: "स्मरण: कल की IT वेब डेवलपमेंट कक्षा सुबह 10 बजे शुरू होगी। कृपया सुनिश्चित करें कि आपका बच्चा 5 मिनट पहले ऑनलाइन हो।",
    sentTo: 0 as number,
  });
  const [sendingBulk, setSendingBulk] = useState(false);

  const send = (id: string) => {
    setDrafts((d) => d.map((x) => (x.id === id ? { ...x, sent: true } : x)));
  };

  const sendBulk = () => {
    if (sendingBulk) return;
    setSendingBulk(true);
    setTimeout(() => {
      setBulk((b) => ({ ...b, sentTo: 32 }));
      setSendingBulk(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[15px] font-semibold">Parent Communications</div>
          <div className="text-[11px] text-gray-500">AI-drafted alerts & achievements · WhatsApp delivery</div>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
        <button
          onClick={() => setTab("drafts")}
          className={`flex-1 rounded-md px-3 py-1.5 text-[12px] font-medium ${tab === "drafts" ? "bg-emerald-100 text-emerald-800" : "text-gray-600"}`}
        >
          AI drafts ({drafts.filter((d) => !d.sent).length})
        </button>
        <button
          onClick={() => setTab("bulk")}
          className={`flex-1 rounded-md px-3 py-1.5 text-[12px] font-medium ${tab === "bulk" ? "bg-emerald-100 text-emerald-800" : "text-gray-600"}`}
        >
          Bulk announcement
        </button>
      </div>

      {tab === "drafts" && (
        <div className="space-y-2">
          {drafts.map((d) => (
            <DraftCard key={d.id} draft={d} onSend={() => send(d.id)} />
          ))}
        </div>
      )}

      {tab === "bulk" && (
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[13px] font-medium">
              <Users className="h-4 w-4 text-emerald-600" /> Class IT-11A · 32 parents
            </div>
            <Badge tone="green">WhatsApp Business</Badge>
          </div>
          <div className="space-y-2">
            <Field label="English message">
              <textarea
                rows={3}
                value={bulk.en}
                onChange={(e) => setBulk({ ...bulk, en: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>
            <Field label={<span className="flex items-center gap-1"><Languages className="h-3 w-3" /> हिंदी अनुवाद (AI)</span>}>
              <textarea
                rows={3}
                value={bulk.hi}
                onChange={(e) => setBulk({ ...bulk, hi: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[11px] text-gray-500">
              {bulk.sentTo > 0 ? <span className="text-emerald-600 font-medium">✓ Sent to {bulk.sentTo} parents</span> : "Both languages will be sent together"}
            </div>
            <button
              onClick={sendBulk}
              disabled={sendingBulk || bulk.sentTo > 0}
              className="flex items-center gap-1 rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:from-emerald-700 hover:to-green-700 disabled:opacity-60"
            >
              {sendingBulk ? "Sending..." : bulk.sentTo > 0 ? <><CheckCircle2 className="h-3.5 w-3.5" /> Sent</> : <><Send className="h-3.5 w-3.5" /> Send to 32 parents</>}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

function DraftCard({ draft, onSend }: { draft: Draft; onSend: () => void }) {
  const [hi, setHi] = useState(false);
  const isAlert = draft.type === "alert";
  return (
    <Card className={isAlert ? "border-l-4 border-l-rose-400" : "border-l-4 border-l-emerald-400"}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isAlert ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
            {isAlert ? <AlertCircle className="h-4 w-4" /> : <Award className="h-4 w-4" />}
          </div>
          <div>
            <div className="text-[13px] font-medium">{draft.student}</div>
            <div className="text-[10.5px] text-gray-500">{draft.parent} · {draft.phone}</div>
          </div>
        </div>
        <Badge tone={isAlert ? "red" : "green"}>
          <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI-drafted</span>
        </Badge>
      </div>
      <div className={`rounded-md px-3 py-2 text-[12px] leading-relaxed ${isAlert ? "bg-rose-50 text-rose-900" : "bg-emerald-50 text-emerald-900"}`}>
        {hi ? draft.hi : draft.en}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => setHi((v) => !v)}
          className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
        >
          <Languages className="h-3 w-3" /> {hi ? "English" : "हिंदी"}
        </button>
        <button
          onClick={onSend}
          disabled={draft.sent}
          className="flex items-center gap-1 rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:from-emerald-700 hover:to-green-700 disabled:opacity-60"
        >
          {draft.sent ? <><CheckCircle2 className="h-3.5 w-3.5" /> Sent via WhatsApp</> : <><Send className="h-3.5 w-3.5" /> Send WhatsApp</>}
        </button>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] text-gray-500">{label}</div>
      {children}
    </div>
  );
}
