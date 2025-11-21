import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WordData, ArticleData, SentenceFeedback, WritingFeedback, DifficultyLevel } from "../types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVocabulary = async (theme: string, difficulty: DifficultyLevel = 'C1', excludeWords: string[] = []): Promise<WordData[]> => {
  const ai = getClient();
  
  const levelText = ['IELTS', 'TOEFL', 'SAT'].includes(difficulty) 
    ? `${difficulty} exam level` 
    : `CEFR level ${difficulty}`;

  let prompt = `Generate 8 English vocabulary words at ${levelText} for the theme: "${theme}". 
    Include phonetic transcription (IPA), a simple English definition, Chinese translation, an example sentence using the word in a ${difficulty} level context, and the Chinese translation of the example sentence.
    Also include the word broken into syllables (e.g., "e-du-ca-tion") and its part of speech (e.g., "noun", "adjective").`;

  if (excludeWords.length > 0) {
    prompt += ` Do not include the following words: ${excludeWords.join(', ')}.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            definition: { type: Type.STRING },
            translation: { type: Type.STRING },
            exampleSentence: { type: Type.STRING },
            exampleTranslation: { type: Type.STRING },
            syllables: { type: Type.STRING, description: "The word split by hyphens for syllables, e.g., 'com-put-er'" },
            partOfSpeech: { type: Type.STRING, description: "e.g., noun, verb, adj" },
          },
          required: ["word", "phonetic", "definition", "translation", "exampleSentence", "exampleTranslation", "syllables", "partOfSpeech"]
        },
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as WordData[];
  }
  throw new Error("Failed to generate vocabulary");
};

export const generateWordDetails = async (word: string, theme: string, difficulty: DifficultyLevel): Promise<WordData> => {
  const ai = getClient();
  const levelText = ['IELTS', 'TOEFL', 'SAT'].includes(difficulty) 
    ? `${difficulty} exam level` 
    : `CEFR level ${difficulty}`;

  const prompt = `Generate details for the English vocabulary word "${word}" (${levelText}) related to the theme "${theme}".
    Include phonetic transcription (IPA), a simple English definition, Chinese translation, an example sentence using the word in a ${difficulty} level context, and the Chinese translation of the example sentence.
    Also include the word broken into syllables and its part of speech.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          phonetic: { type: Type.STRING },
          definition: { type: Type.STRING },
          translation: { type: Type.STRING },
          exampleSentence: { type: Type.STRING },
          exampleTranslation: { type: Type.STRING },
          syllables: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
        },
        required: ["word", "phonetic", "definition", "translation", "exampleSentence", "exampleTranslation", "syllables", "partOfSpeech"]
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as WordData;
  }
  throw new Error("Failed to generate word details");
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const checkSentence = async (word: string, sentence: string): Promise<SentenceFeedback> => {
  const ai = getClient();
  const prompt = `
  Review this user-written sentence using the English word "${word}".
  Sentence: "${sentence}"
  
  1. Is it grammatically correct and does it use the word correctly in a formal context?
  2. If incorrect, provide a corrected version.
  3. Provide a brief explanation in Chinese.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          correctedSentence: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["isCorrect", "explanation"]
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as SentenceFeedback;
  }
  throw new Error("Failed to check sentence");
};

export const generateArticle = async (theme: string, words: string[]): Promise<ArticleData> => {
  const ai = getClient();
  const prompt = `Write a short, academic-style article (approx 150-200 words) suitable for English learners about "${theme}" that naturally includes these words: ${words.join(', ')}. 
  Also provide a Chinese translation.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          translation: { type: Type.STRING },
        },
        required: ["title", "content", "translation"]
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as ArticleData;
  }
  throw new Error("Failed to generate article");
};

export const reviewWriting = async (theme: string, userText: string): Promise<WritingFeedback> => {
  const ai = getClient();
  const prompt = `
  Review this user's short essay on the theme "${theme}".
  User Text: "${userText}"
  
  Provide:
  1. A band score estimate (0-9) based on IELTS criteria.
  2. Critique and tips in Chinese (focus on vocabulary and coherence).
  3. An improved/native-like version of the text in English (Band 9 level).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER },
          critique: { type: Type.STRING },
          improvedVersion: { type: Type.STRING },
        },
        required: ["score", "critique", "improvedVersion"]
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as WritingFeedback;
  }
  throw new Error("Failed to review writing");
};