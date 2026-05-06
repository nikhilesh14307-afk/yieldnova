import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2, Sprout } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Farming Assistant — AgriSmart" }, { name: "description", content: "Chat with an AI agronomist about your crops, soil, and weather." }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const askAI = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Msg[] }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are AgriSmart, a friendly, knowledgeable AI agronomist helping farmers. Give practical, concise advice on crop selection, irrigation, fertilizers, pests, weather risks, soil health, and yield optimization. Use short paragraphs and bullet points. Always assume the user is a working farmer with limited time." },
          ...data.messages,
        ],
      }),
    });
    if (res.status === 429) throw new Error("Rate limited — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) throw new Error(`AI error ${res.status}`);
    const json = await res.json();
    return { reply: json.choices?.[0]?.message?.content ?? "" };
  });

const SUGGESTIONS = [
  "What should I grow this season in clay soil?",
  "How to improve wheat yield naturally?",
  "Best irrigation schedule for maize in summer?",
  "Organic remedies for leaf rust?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your AgriSmart assistant 🌱 — ask me anything about your crops, soil, weather, or yield." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await askAI({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: r.reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <header className="mb-6">
        <h1 className="font-display text-4xl font-semibold flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" /> AI Farming Assistant
        </h1>
        <p className="text-muted-foreground mt-2">Ask anything about agriculture — powered by Lovable AI.</p>
      </header>

      <Card className="flex flex-col h-[65vh] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                {m.role === "user" ? "U" : <Sprout className="h-4 w-4" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 max-w-[80%] whitespace-pre-wrap text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sprout className="h-4 w-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-secondary text-secondary-foreground text-sm flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs rounded-full border border-border px-3 py-1.5 hover:bg-secondary transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border p-3 flex gap-2 bg-card">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about crops, soil, weather…" disabled={loading} />
          <Button type="submit" disabled={loading || !input.trim()} size="icon" className="shadow-[var(--shadow-glow)]">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
