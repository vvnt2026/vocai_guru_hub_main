import { createFileRoute } from "@tanstack/react-router";
import {
  Hand,
  MessageCircle,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Pin,
  Send,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/student/live-class")({ component: LiveClass });

interface Participant {
  name: string;
  initials: string;
  color: string;
  isTeacher?: boolean;
  speaking?: boolean;
  muted?: boolean;
  camOff?: boolean;
  hand?: boolean;
}

interface ChatMsg {
  who: string;
  text: string;
  time: string;
  teacher?: boolean;
  self?: boolean;
}

const INITIAL_PARTICIPANTS: Participant[] = [
  { name: "Rajesh Kumar Sir", initials: "RK", color: "from-indigo-500 to-blue-600", isTeacher: true, speaking: true },
  { name: "Priya (You)", initials: "PR", color: "from-emerald-500 to-teal-600", muted: true },
  { name: "Rahul Singh", initials: "RS", color: "from-amber-500 to-orange-600" },
  { name: "Ananya Patel", initials: "AP", color: "from-rose-500 to-pink-600", hand: true },
  { name: "Vikram Yadav", initials: "VY", color: "from-purple-500 to-fuchsia-600", camOff: true },
  { name: "Sneha Kumari", initials: "SK", color: "from-cyan-500 to-sky-600", muted: true },
];

const INITIAL_CHAT: ChatMsg[] = [
  { who: "Priya", text: "Sir, what is the difference between margin and padding?", time: "3:12 PM", self: true },
  { who: "Rahul", text: "Sir please explain flexbox again 🙏", time: "3:14 PM" },
  { who: "Teacher", text: "Great question Priya! Margin is outside, padding is inside the element.", time: "3:15 PM", teacher: true },
  { who: "Ananya", text: "Can you share the notes after class?", time: "3:16 PM" },
];

function Tile({ p, pinned, onPin }: { p: Participant; pinned: boolean; onPin: () => void }) {
  return (
    <button
      onClick={onPin}
      className={`group relative aspect-video w-full overflow-hidden rounded-xl border bg-gradient-to-br ${p.color} text-white shadow-sm transition-all ${
        pinned ? "ring-2 ring-emerald-400 ring-offset-1" : "hover:ring-2 hover:ring-white/40"
      } ${p.speaking ? "outline outline-2 outline-emerald-400" : "border-white/10"}`}
    >
      {/* subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        {p.camOff ? (
          <div className="flex flex-col items-center gap-1">
            <VideoOff className="h-5 w-5 opacity-80" />
            <span className="text-[10px] opacity-80">Camera off</span>
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-[15px] font-semibold ring-2 ring-white/30">
            {p.initials}
          </div>
        )}
      </div>

      {/* top badges */}
      <div className="absolute left-1.5 top-1.5 flex gap-1">
        {p.isTeacher && (
          <span className="rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700">
            HOST
          </span>
        )}
        {p.hand && (
          <span className="flex items-center gap-0.5 rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-semibold text-amber-950">
            <Hand className="h-2.5 w-2.5" /> Raised
          </span>
        )}
      </div>

      {/* bottom name */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
        <div className="flex items-center gap-1 text-[10.5px] font-medium">
          {p.muted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3 text-emerald-300" />}
          <span className="truncate">{p.name}</span>
        </div>
        {pinned && <Pin className="h-3 w-3" />}
      </div>

      {/* speaking pulse */}
      {p.speaking && !p.muted && (
        <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      )}
    </button>
  );
}

function LiveClass() {
  const [pinnedIdx, setPinnedIdx] = useState(0);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [hand, setHand] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [chat, setChat] = useState<ChatMsg[]>(INITIAL_CHAT);
  const [input, setInput] = useState("");
  const [elapsed, setElapsed] = useState(28 * 60 + 14); // 28:14
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setChat((c) => [...c, { who: "Priya", text, time, self: true }]);
    setInput("");
    // simulated teacher reply
    setTimeout(() => {
      setChat((c) => [
        ...c,
        { who: "Teacher", text: "Good question — I'll cover that in the next slide.", time, teacher: true },
      ]);
    }, 1400);
  };

  const pinned = INITIAL_PARTICIPANTS[pinnedIdx];

  return (
    <div className="space-y-3">
      {/* status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 via-white to-emerald-50 px-3 py-2">
        <div className="flex items-center gap-3 text-[12px]">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="font-semibold text-red-600">LIVE</span>
          </span>
          <span className="text-gray-600">HTML & CSS — Module 5</span>
          <span className="hidden text-gray-400 sm:inline">·</span>
          <span className="hidden items-center gap-1 text-gray-600 sm:flex">
            <Users className="h-3.5 w-3.5" /> 28 joined
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="rounded bg-red-50 px-2 py-0.5 font-medium text-red-600">● REC</span>
          <span className="rounded bg-gray-900 px-2 py-0.5 font-mono text-white">{fmt(elapsed)}</span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
        {/* video area */}
        <div className="space-y-2">
          {/* main pinned tile */}
          <div className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br ${pinned.color} text-white shadow-md`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.22),transparent_55%)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {pinned.camOff ? (
                <>
                  <VideoOff className="h-8 w-8 opacity-90" />
                  <div className="mt-2 text-[13px]">Camera off</div>
                </>
              ) : (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-[22px] font-semibold ring-4 ring-white/30">
                    {pinned.initials}
                  </div>
                  <div className="mt-3 text-[15px] font-medium">{pinned.name}</div>
                  <div className="text-[11.5px] opacity-90">IT & ITeS — HTML & CSS Basics</div>
                </>
              )}
            </div>
            <div className="absolute left-3 top-3 flex gap-1.5">
              {pinned.isTeacher && (
                <span className="rounded bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">HOST</span>
              )}
              <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">HD</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[11.5px]">
              <span className="flex items-center gap-1.5">
                {pinned.muted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-emerald-300" />}
                {pinned.name}
              </span>
              <span className="flex items-center gap-1 opacity-90">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            </div>
          </div>

          {/* thumbnail strip */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {INITIAL_PARTICIPANTS.map((p, i) => (
              <Tile key={p.name} p={p} pinned={i === pinnedIdx} onPin={() => setPinnedIdx(i)} />
            ))}
          </div>

          {/* controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            <button
              onClick={() => setMicOn((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                micOn ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {micOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
              {micOn ? "Mic on" : "Mic off"}
            </button>
            <button
              onClick={() => setCamOn((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                camOn ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {camOn ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
              {camOn ? "Camera on" : "Camera off"}
            </button>
            <button
              onClick={() => setHand((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                hand ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Hand className="h-3.5 w-3.5" />
              {hand ? "Hand raised" : "Raise hand"}
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-200">
              <MonitorUp className="h-3.5 w-3.5" />
              Share
            </button>
            <button
              onClick={() => setChatOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                chatOpen ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-red-700">
              <PhoneOff className="h-3.5 w-3.5" />
              Leave
            </button>
          </div>
        </div>

        {/* chat panel */}
        {chatOpen && (
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[13px] font-medium">Class chat</div>
              <span className="text-[10px] text-gray-500">{chat.length} messages</span>
            </div>
            <div className="flex h-[280px] flex-col gap-2 overflow-y-auto pr-1 text-[12px]">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-2.5 py-1.5 ${
                    m.teacher
                      ? "bg-indigo-50 text-indigo-900"
                      : m.self
                      ? "ml-auto bg-emerald-600 text-white"
                      : "bg-gray-50 text-gray-800"
                  } max-w-[90%]`}
                >
                  <div className={`text-[10px] font-semibold ${m.self ? "text-emerald-100" : m.teacher ? "text-indigo-600" : "text-gray-500"}`}>
                    {m.who} · {m.time}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="mt-2 flex gap-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-[11.5px] focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              />
              <button
                onClick={send}
                className="flex items-center justify-center rounded-md bg-emerald-600 px-2.5 text-white hover:bg-emerald-700"
                aria-label="Send"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
