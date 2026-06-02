import { callLovableAI } from "./src/lib/ai-gateway.server.js";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  try {
    const RECOMMEND_SYSTEM_EN =
      "You are an NSQF vocational career counselor for Samagra Shiksha, India. Given a student profile, recommend the TOP 3 best-fit NSQF vocational trades for Class 9–12 from this list: IT & ITeS, Healthcare, Retail, Automotive, Beauty & Wellness, Tourism & Hospitality, Agriculture, Electronics & Hardware, Apparel & Textiles, Banking & Finance, Media & Entertainment, Construction. For each, write 2 sentences of reasoning tied specifically to the student's class, state job market, interests, and learning style. Mention real Indian employers (e.g. TCS, Wipro, Apollo, Maruti, Lifestyle) and schemes (PMKVY, NSDC, Skill India) where relevant. Respond ONLY as strict JSON: {\"trades\":[{\"name\":string,\"match\":number(60-98),\"reason\":string,\"sampleJobs\":[string,string,string],\"avgSalary\":string},...]}. No prose outside JSON.";

    const raw = await callLovableAI({
      maxTokens: 2500,
      messages: [
        { role: "system", content: RECOMMEND_SYSTEM_EN },
        {
          role: "user",
          content: `Student profile:\nName: Priya\nClass: Class 10\nState: Uttar Pradesh\nInterests: Technology, People skills\nLearning style: Hands-on / practical\n\nReturn top 3 NSQF trades as JSON.`,
        },
      ],
    });
    
    console.log("---- RAW RESPONSE START ----");
    console.log(raw);
    console.log("---- RAW RESPONSE END ----");
    
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }
    
    const m = cleaned.match(/\{[\s\S]*\}/);
    const parsed = m ? JSON.parse(m[0]) : JSON.parse(cleaned);
    console.log("SUCCESSFULLY PARSED!");
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
test();
