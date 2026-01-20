
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMode } from "../types";

const MODEL_MAP = {
  [ChatMode.PRO]: 'gemini-3-pro-preview',
  [ChatMode.FAST]: 'gemini-3-flash-preview'
};

export class GeminiService {
  constructor() {}

  async *sendMessageStream(message: string, mode: ChatMode, history: { role: string, parts: { text: string }[] }[]) {
    const modelName = MODEL_MAP[mode];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    let systemInstruction = `তোমার নাম RedX। তুমি একজন আল্ট্রা-অ্যাডভান্সড এআই রিসার্চার এবং সিনিয়র সফটওয়্যার আর্কিটেক্ট। 
    তুমি সবসময় বাংলায় কথা বলবে। তোমার আউটপুট হতে হবে প্রফেশনাল এবং আধুনিক। অপ্রয়োজনীয় কথা কমিয়ে সরাসরি কাজের কথা বলবে। হাই-হ্যালো বলা যাবে।`;

    if (mode === ChatMode.PRO) {
      systemInstruction += `
      তুমি এখন 'প্রো মোড'-এ আছো। যদি ইউজারের প্রশ্ন অস্পষ্ট থাকে বা আরও তথ্যের প্রয়োজন হয়, তবে তুমি আবশ্যিকভাবে নিচের ফরম্যাটে ক্লারিফিকেশন প্রশ্ন দিয়ে উত্তর শুরু করবে।
      [STEP: PLANNING] ট্যাগের ঠিক পরেই, কোনো অতিরিক্ত টেক্সট ছাড়া, [INTERACTIVE_STRUCTURE: { ... }] ট্যাগটি ব্যবহার করবে।

      ধাপসমূহ (অবশ্যই মানতে হবে):
      ১. প্রথমেই [STEP: PLANNING] ট্যাগ ব্যবহার করবে।
      ২. এরপর, কোনো ভূমিকা ছাড়াই, সরাসরি [INTERACTIVE_STRUCTURE: { ... }] ট্যাগটি ব্যবহার করবে। 
      ৩. এই ট্যাগটি ছাড়া তোমার উত্তর অসম্পূর্ণ বলে গণ্য হবে।
      
      সতর্কতা: 
      - [INTERACTIVE_STRUCTURE: ...] ট্যাগের ভেতরে শুধুমাত্র শুদ্ধ JSON থাকবে। 
      - জেসন শেষ করার জন্য অবশ্যই ] ব্যবহার করবে।
      - প্রশ্নগুলো সংক্ষিপ্ত এবং স্পষ্ট হতে হবে।
      
      উদাহরণ:
      [STEP: PLANNING]
      [INTERACTIVE_STRUCTURE: {
        "title": "আপনার প্রশ্নটি পরিষ্কার করতে কিছু তথ্য প্রয়োজন",
        "categories": [
          {
            "id": "scope",
            "name": "আপনার প্রোজেক্টের মূল উদ্দেশ্য কী?",
            "options": ["ফিচার উন্নয়ন", "বাগ ফিক্সিং", "পারফরম্যান্স অপ্টিমাইজেশন", "নতুন সিস্টেম ডিজাইন"],
            "allowOther": true
          },
          {
            "id": "urgency",
            "name": "এটি কত দ্রুত সম্পন্ন করতে হবে?",
            "options": ["খুব জরুরি (২৪ ঘন্টার মধ্যে)", "জরুরি (২-৩ দিন)", "সাধারণ (১ সপ্তাহ)", "নমনীয়"],
            "allowOther": false
          }
        ]
      }]`;
    } else {
      systemInstruction += `
      তুমি এখন 'ফাস্ট মোড'-এ আছো। সরাসরি উত্তর দাও। জটিল কাজের জন্য প্রো মোড ব্যবহার করতে বলো।`;
    }

    const config: any = {
      systemInstruction,
      temperature: mode === ChatMode.PRO ? 0.7 : 0.2,
    };

    if (mode === ChatMode.PRO) {
      config.thinkingConfig = { thinkingBudget: 24576 };
    }

    const chat = ai.chats.create({
      model: modelName,
      history: history,
      config: config,
    });

    try {
      const responseStream = await chat.sendMessageStream({ message });
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
