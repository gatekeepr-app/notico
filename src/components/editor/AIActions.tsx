import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "../Toast";

interface AIActionsProps {
  content: string;
  onResult: (text: string) => void;
}

const OLLAMA_CLOUD_API = "https://api.ollama.com/api/chat";

export function AIActions({ content, onResult }: AIActionsProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"summarize" | "rewrite" | null>(null);
  const { toast } = useToast();

  const callOllamaCloud = async (systemPrompt: string, userText: string) => {
    setLoading(true);
    const apiKey = localStorage.getItem("notico-ollama-key") || "";
    if (!apiKey) {
      toast("Set your Ollama API key in Settings", "error");
      setLoading(false);
      setMode(null);
      return;
    }
    try {
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
        toast(`AI error: ${res.status}`, "error");
        return;
      }
      const data = await res.json();
      const text = data.message?.content || data.response || "";
      if (text) onResult(text);
    } catch {
      toast("AI: Could not reach Ollama Cloud", "error");
    } finally {
      setLoading(false);
      setMode(null);
    }
  };

  const handleSummarize = () => {
    setMode("summarize");
    const text = content.replace(/<[^>]*>/g, "").trim();
    if (!text) { toast("Nothing to summarize", "error"); setMode(null); return; }
    callOllamaCloud("Summarize the following text in 2-3 concise sentences.", text);
  };

  const handleRewrite = () => {
    setMode("rewrite");
    const text = content.replace(/<[^>]*>/g, "").trim();
    if (!text) { toast("Nothing to rewrite", "error"); setMode(null); return; }
    callOllamaCloud("Rewrite the following text to be clearer and more concise while preserving all key information.", text);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors disabled:opacity-50"
      >
        {loading && mode === "summarize" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Summarize
      </button>
      <button
        onClick={handleRewrite}
        disabled={loading}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors disabled:opacity-50"
      >
        {loading && mode === "rewrite" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Rewrite
      </button>
    </div>
  );
}
