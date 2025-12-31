"use client";

import { useEffect, useRef, useState } from "react";
import api from "../lib/api";

const starterMessages = [
  {
    id: "welcome",
    role: "assistant",
    text: "Welcome to Sunset Plaza. How can I assist with your office search or investment goals?",
  },
];
const quickActions = [
  {
    label: "Availability",
    text: "What spaces are available right now?",
  },
  {
    label: "Book a tour",
    text: "I want to schedule a private tour.",
  },
  {
    label: "Investing",
    text: "Share the best investment opportunities.",
  },
  {
    label: "Pricing",
    text: "What is the price range for executive suites?",
  },
];

const bookingTag = "<SHOW_BOOKING_FORM>";

export default function ChatbotWidget({
  open,
  onOpen,
  onClose,
  onBookingForm,
}) {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const resetChat = () => {
    setMessages(starterMessages);
  };

  const sendMessage = async (nextText) => {
    const question = (nextText ?? input).trim();
    if (!question || sending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await api.post("/api/chatbot/ask/", { question });
      const rawReply =
        response?.data?.response ||
        "Thanks for reaching out. A concierge will follow up shortly.";
      const shouldShowBookingForm = rawReply.includes(bookingTag);
      const replyText = rawReply.replace(bookingTag, "").trim();
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: "assistant", text: replyText },
      ]);
      if (shouldShowBookingForm) {
        onBookingForm?.(
          `Chatbot flagged this as a priority request. User asked: "${question}".`,
        );
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: "We are currently offline. Please leave your details in the contact form below.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:text-slate-900"
      >
        Ask AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="border-b border-white/70 bg-white/70 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-linear-to-br from-amber-200 via-amber-400 to-amber-500 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-[0_10px_25px_rgba(251,191,36,0.4)]">
              SP
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                Sunset AI
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Private concierge
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Available now
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetChat}
              className="rounded-full border border-slate-200 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:border-slate-300 hover:text-slate-700"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:border-slate-300 hover:text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[380px] flex-col bg-white/80">
        <div
          ref={listRef}
          className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
          aria-live="polite"
        >
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" ? (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-[14px] bg-amber-100 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                    SP
                  </div>
                  <div className="max-w-[75%] rounded-3xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-3xl rounded-tr-md bg-[#007aff] px-4 py-3 text-sm leading-relaxed text-white shadow-[0_12px_24px_rgba(0,122,255,0.3)]">
                    {message.text}
                  </div>
                </div>
              )}
            </div>
          ))}
          {sending ? (
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Assistant typing</span>
              <span className="typing-dot" />
              <span className="typing-dot typing-delay-1" />
              <span className="typing-dot typing-delay-2" />
            </div>
          ) : null}
        </div>

        {/* --- FIXED SECTION STARTS HERE --- */}
        <div className="border-t border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-md">
          {/* iOS Style Horizontal Quick Actions */}
          <div className="mb-3 flex w-full gap-2 overflow-x-auto pb-1 pt-1 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.text)}
                className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] font-medium text-slate-600 transition-all hover:bg-slate-100 active:scale-95 active:bg-slate-200"
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
            <textarea
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Enter message"
              className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={sending}
              className="flex h-8 w-8 items-center justify-center text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
        {/* --- FIXED SECTION ENDS HERE --- */}
      </div>
    </div>
  );
}
