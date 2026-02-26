"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant" | "system";

type Message = {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const createMessage = (params: Omit<Message, "id" | "timestamp">): Message => {
  const now = new Date();
  return {
    id: `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
    timestamp: formatTime(now),
    ...params,
  };
};

const initialMessages: Message[] = [
  createMessage({
    role: "system",
    content: "You are chatting with an AI agent. Ask anything about your product, users, or data.",
  }),
  createMessage({
    role: "assistant",
    content:
      "Hey, I’m ready when you are. Tell me what you’re working on and I’ll help you break it down.",
  }),
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState("agent-default");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMessage = createMessage({
      role: "user",
      content: trimmed,
    });

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Mock AI response – replace with FastAPI call when wiring backend
    setTimeout(() => {
      const assistantMessage = createMessage({
        role: "assistant",
        content:
          "This is a mock AI response. In your real app, this will stream from your FastAPI + agent backend.",
      });
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 900);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950/90 px-4 py-6 text-slate-50">
      <main className="flex h-[min(44rem,calc(100vh-3rem))] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 shadow-[0_20px_80px_rgba(15,23,42,0.85)] backdrop-blur-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-lg font-semibold">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-tight text-slate-50">
                  Chatbot Console
                </h1>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                  Live
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                Frontend-only UI • Next.js + FastAPI agent ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 sm:flex">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]" />
              <span className="font-medium">Connected</span>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="rounded-2xl border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 outline-none ring-0 transition hover:border-slate-500 focus-visible:border-sky-400"
            >
              <option value="agent-default">Agent · Default</option>
              <option value="agent-fast">Agent · Fast</option>
              <option value="agent-precise">Agent · Precise</option>
            </select>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 px-5 pb-4 pt-3 sm:flex-row">
          {/* Conversation */}
          <section className="flex h-full flex-1 flex-col rounded-3xl border border-slate-800/80 bg-slate-950/60">
            <div
              ref={listRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-700/70"
            >
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role !== "user" && (
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/90 text-[10px] font-semibold text-slate-950">
                      {message.role === "assistant" ? "AI" : "SYS"}
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-sm bg-sky-500 text-sky-50 shadow-[0_10px_40px_rgba(56,189,248,0.35)]"
                        : message.role === "system"
                        ? "rounded-tl-sm border border-dashed border-slate-700 bg-slate-900/70 text-slate-300"
                        : "rounded-tl-sm border border-slate-800 bg-slate-900/80 text-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <div
                      className={`mt-1.5 text-[10px] ${
                        message.role === "user"
                          ? "text-sky-50/80"
                          : "text-slate-400/80"
                      }`}
                    >
                      {message.role === "user" ? "You • " : "Assistant • "}
                      {message.timestamp}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-sky-400/60 bg-slate-900/90 text-[10px] font-semibold text-sky-200">
                      You
                    </div>
                  )}
                </article>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                  Thinking…
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-3"
            >
              <div className="flex items-end gap-2">
                <div className="flex-1 rounded-2xl border border-slate-700/80 bg-slate-950/80 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.8)] focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-500/60">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your agent anything…"
                    className="w-full resize-none bg-transparent text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Shift + Enter for newline</span>
                    <span>Frontend-only mock · no data sent</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-500 px-4 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.5)] transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300 disabled:shadow-none"
                >
                  {isThinking ? "…" : "Send"}
                </button>
              </div>
            </form>
          </section>

          {/* Sidebar / quick actions */}
          <aside className="mt-1 flex w-full flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 text-xs text-slate-300 sm:mt-0 sm:w-64">
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Quick prompts
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Summarize this feature spec.",
                  "Draft a message to my team.",
                  "Help me design the API surface.",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-left text-[11px] text-slate-200 transition hover:border-sky-500 hover:bg-slate-900"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />

            <div className="space-y-1">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Session
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-400">
                This UI is ready to be connected to your FastAPI backend. Plug
                in streaming responses, tools, and agent state without changing
                the layout.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
