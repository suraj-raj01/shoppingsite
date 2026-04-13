import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function chatBot(messages) {
  try {
    // ✅ ensure array
    if (!Array.isArray(messages)) {
      messages = [
        {
          role: "user",
          content: String(messages),
        },
      ];
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedMessages,
    });

    return response.text || "No response from AI";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong. Please try again.";
  }
}