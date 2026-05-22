import { v } from "convex/values";
import { action } from "./_generated/server";

declare var process: { env: Record<string, string | undefined> };

const OLLAMA_CLOUD_API = "https://api.ollama.com/api/chat";

async function callOllama(systemPrompt: string, userText: string) {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    throw new Error("OLLAMA_API_KEY environment variable not set in Convex dashboard");
  }
  const res = await fetch(OLLAMA_CLOUD_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText.slice(0, 3000) },
      ],
      stream: false,
    }),
  });
  if (!res.ok) {
    throw new Error(`Ollama API returned ${res.status}`);
  }
  const data = await res.json();
  return data.message?.content || data.response || "";
}

export const summarize = action({
  args: { text: v.string() },
  handler: async (_, args) => {
    return await callOllama("Summarize the following text in 2-3 concise sentences.", args.text);
  },
});

export const rewrite = action({
  args: { text: v.string() },
  handler: async (_, args) => {
    return await callOllama("Rewrite the following text to be clearer and more concise.", args.text);
  },
});
