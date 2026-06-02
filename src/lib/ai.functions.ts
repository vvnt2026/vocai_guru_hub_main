import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callLovableAI, type ChatMessage } from "./ai-gateway.server";

const MENTOR_SYSTEM_EN =
  "You are an AI vocational mentor for IT & ITeS under Samagra Shiksha, India. Student: Priya Sharma, Class 11, Uttar Pradesh, 68% through IT Fundamentals, NSQF Level 3. Be warm, practical, India-specific. Maximum 3 paragraphs. Mention PMKVY, NSDC, Skill India, and real IT companies when relevant.";

const MENTOR_SYSTEM_HI =
  "आप समग्र शिक्षा, भारत के तहत IT व ITeS के लिए एक AI व्यावसायिक मेंटर हैं। छात्रा: प्रिया शर्मा, कक्षा 11, उत्तर प्रदेश, IT फंडामेंटल्स में 68% पूर्ण, NSQF स्तर 3। सरल, व्यावहारिक हिंदी में उत्तर दें। अधिकतम 3 पैराग्राफ। PMKVY, NSDC, Skill India और वास्तविक IT कंपनियों का उल्लेख करें जहाँ उपयुक्त हो।";

const PARENT_SYSTEM =
  "You are VocAI Guru's parent helpline assistant for Samagra Shiksha. You are speaking to the parent of Priya Sharma, a Class 11 student in Varanasi, Uttar Pradesh, studying IT & ITeS vocational trade (NSQF Level 3). Progress: 68% complete, 8/12 modules done, last score 88%, 12-day streak. RULES: Always respond in simple Hindi (Devanagari). Use English only for technical terms, company names, salary numbers. Address the parent as 'आप'. Reassure about safety and job security — top parent concerns. Mention real UP companies (Wipro BPO Noida ₹15k, TCS iON Lucknow ₹18k, HCL Tech Noida ₹20k, NIIT, Infosys) and schemes (PMKVY, Skill India, NSDC, Samagra Shiksha). 4-5 short paragraphs max. End with a helpful follow-up question in Hindi. Never say 'I don't know'.";

const HINDI_MENTOR_SYSTEM =
  "You are an AI vocational mentor for Samagra Shiksha, India. Student: Priya Sharma, Class 11, Varanasi, UP, IT & ITeS trade, NSQF Level 3, 68% progress. CRITICAL: Always respond in simple Hindi (Devanagari script) that a Class 11 rural UP student understands. Mix English only for technical terms (NSQF, PMKVY), company names, and salary figures. Never reply in English even if student writes in English. 4-5 short paragraphs max. End with a follow-up question in Hindi. Reference real UP companies: Wipro, TCS, HCL, Infosys, NIIT, Aptech. Schemes: PMKVY, Skill India, NSDC, NIELIT. Varanasi training centres when relevant.";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const askMentor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        messages: z.array(MessageSchema).min(1).max(40),
        lang: z.enum(["en", "hi"]).optional(),
        persona: z.enum(["mentor", "hindi-mentor", "parent"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    let system: string;
    if (data.persona === "parent") system = PARENT_SYSTEM;
    else if (data.persona === "hindi-mentor") system = HINDI_MENTOR_SYSTEM;
    else system = data.lang === "hi" ? MENTOR_SYSTEM_HI : MENTOR_SYSTEM_EN;

    const messages: ChatMessage[] = [
      { role: "system", content: system },
      ...data.messages,
    ];
    try {
      const reply = await callLovableAI({ messages, maxTokens: 700 });
      return { reply, error: null as string | null };
    } catch (e) {
      return { reply: "", error: e instanceof Error ? e.message : "AI error" };
    }
  });

const LESSON_SYSTEM =
  "Expert teacher trainer for Samagra Shiksha vocational education India. Generate practical NSQF-aligned lesson plans in plain text. Format with these sections: Learning Objectives (3 bullet points), Materials Needed, Lesson Structure with time breakdown, Key Activities (2-3 practical activities for rural/semi-urban Indian students), Assessment Method, Homework. Use simple practical language for government school teachers.";

export const generateLessonPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        trade: z.string().min(1).max(100),
        classLevel: z.string().min(1).max(50),
        topic: z.string().min(1).max(200),
        duration: z.string().min(1).max(50),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    try {
      const reply = await callLovableAI({
        maxTokens: 900,
        messages: [
          { role: "system", content: LESSON_SYSTEM },
          {
            role: "user",
            content: `Create a ${data.duration} lesson plan:\nTrade: ${data.trade}\nClass: ${data.classLevel}\nTopic: ${data.topic}`,
          },
        ],
      });
      return { plan: reply, error: null as string | null };
    } catch (e) {
      return { plan: "", error: e instanceof Error ? e.message : "AI error" };
    }
  });

const RECOMMEND_SYSTEM_EN =
  "You are an NSQF vocational career counselor for Samagra Shiksha, India. Given a student profile, recommend the TOP 3 best-fit NSQF vocational trades for Class 9–12 from this list: IT & ITeS, Healthcare, Retail, Automotive, Beauty & Wellness, Tourism & Hospitality, Agriculture, Electronics & Hardware, Apparel & Textiles, Banking & Finance, Media & Entertainment, Construction. For each, write 2 sentences of reasoning tied specifically to the student's class, state job market, interests, and learning style. Mention real Indian employers (e.g. TCS, Wipro, Apollo, Maruti, Lifestyle) and schemes (PMKVY, NSDC, Skill India) where relevant. Respond ONLY as strict JSON: {\"trades\":[{\"name\":string,\"match\":number(60-98),\"reason\":string,\"sampleJobs\":[string,string,string],\"avgSalary\":string},...]}. No prose outside JSON.";

const RECOMMEND_SYSTEM_HI =
  RECOMMEND_SYSTEM_EN + " Write the 'reason' field in simple Hindi (Devanagari). Keep 'name', 'sampleJobs', and 'avgSalary' in English so they remain searchable.";

const ProfileSchema = z.object({
  name: z.string().min(1).max(80),
  classLevel: z.string().min(1).max(30),
  state: z.string().min(1).max(50),
  interests: z.array(z.string().min(1).max(40)).min(1).max(8),
  learningStyle: z.string().min(1).max(60),
  lang: z.enum(["en", "hi"]).optional(),
});

export type TradeRecommendation = {
  name: string;
  match: number;
  reason: string;
  sampleJobs: string[];
  avgSalary: string;
};

export const recommendTrades = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProfileSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const raw = await callLovableAI({
        maxTokens: 2500,
        responseFormat: { type: "json_object" },
        messages: [
          { role: "system", content: data.lang === "hi" ? RECOMMEND_SYSTEM_HI : RECOMMEND_SYSTEM_EN },
          {
            role: "user",
            content: `Student profile:\nName: ${data.name}\nClass: ${data.classLevel}\nState: ${data.state}\nInterests: ${data.interests.join(", ")}\nLearning style: ${data.learningStyle}\n\nReturn top 3 NSQF trades as JSON.`,
          },
        ],
      });
      
      // Clean markdown formatting if Gemini wrapped the JSON
      let cleaned = raw.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      }
      
      const m = cleaned.match(/\{[\s\S]*\}/);
      const parsed = m ? JSON.parse(m[0]) : JSON.parse(cleaned);
      const trades = (parsed.trades ?? []) as TradeRecommendation[];
      return { trades, error: null as string | null };
    } catch (e) {
      return { trades: [] as TradeRecommendation[], error: e instanceof Error ? e.message : "AI error" };
    }
  });
