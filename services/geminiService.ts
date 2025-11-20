import { GoogleGenAI } from "@google/genai";
import { Message, Source } from "../types";

const SYSTEM_INSTRUCTION = `
أنت مساعد ذكاء اصطناعي إسلامي "البيان".
مهمتك هي الإجابة على الأسئلة الدينية والفقهية والعامة بدقة واحترام، معتمداً على مصادر أهل السنة والجماعة الموثوقة.
عند البحث عن معلومات شرعية، أعط الأولوية للمعلومات المستمدة من المواقع التالية:
- إسلام ويب (Islamweb)
- موقع ابن باز (BinBaz.org.sa)
- الدرر السنية (Dorar.net)
- الإسلام سؤال وجواب (IslamQA)

كن مهذباً، واستخدم لغة عربية فصحى واضحة.
إذا كان السؤال خارج نطاق المعرفة الشرعية أو العامة، أجب بأدب.
`;

export const sendMessageToGemini = async (
  prompt: string,
  history: Message[]
): Promise<{ text: string; sources: Source[] }> => {
  try {
    // Initialize API Client lazily to prevent module-level crashes
    const apiKey = (typeof process !== "undefined" && process.env) ? process.env.API_KEY : "";
    
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your environment configuration.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepare history for the model
    const historyContents = history
      .filter(msg => !msg.isError)
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

    const modelId = 'gemini-2.5-flash'; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...historyContents,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Google Search Grounding
        temperature: 0.3,
      },
    });

    const text = response.text || "عذراً، لم أتمكن من الحصول على إجابة.";
    
    // Extract grounding chunks (sources)
    const sources: Source[] = [];
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "مصدر ويب",
            uri: chunk.web.uri || "#",
          });
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};