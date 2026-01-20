"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export default function ChatWidget() {
    const t = useTranslations('chat')
    const tCommon = useTranslations('common')
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    // Initialize welcome message on mount
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            setMessages([{
                id: "welcome",
                role: "assistant",
                content: t('welcome'),
            }])
        }
    }, [mounted, t])

    const quickActions = [
        { label: t('quickActions.availability'), message: t('quickActions.availability') },
        { label: t('quickActions.pricing'), message: t('quickActions.pricing') },
        { label: t('quickActions.tour'), message: t('quickActions.tour') },
        { label: t('quickActions.invest'), message: t('quickActions.invest') },
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async (text: string) => {
        if (!text.trim()) return

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: text,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await api.post<{ response: string }>("/api/chatbot/ask/", {
                question: text,
            })

            const botMessage: Message = {
                id: `bot-${Date.now()}`,
                role: "assistant",
                content: response.data.response.replace("<SHOW_BOOKING_FORM>", "").trim(),
            }

            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: tCommon('error'),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage(input)
    }

    if (!mounted) return null

    return (
        <>
            {/* Chat Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <MessageCircle className="h-7 w-7" />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold">
                            1
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f59e0b]">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{t('title')}</p>
                                    <p className="text-xs text-slate-300">{t('subtitle')}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${message.role === "user"
                                                ? "bg-amber-100 text-[#d97706]"
                                                : "bg-slate-200 text-slate-600"
                                            }`}
                                    >
                                        {message.role === "user" ? (
                                            <User className="h-4 w-4" />
                                        ) : (
                                            <Bot className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${message.role === "user"
                                                ? "bg-[#f59e0b] text-white rounded-tr-none"
                                                : "bg-white text-slate-700 shadow-sm rounded-tl-none"
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="typing-dot" />
                                            <span className="typing-dot typing-delay-1" />
                                            <span className="typing-dot typing-delay-2" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="p-3 border-t border-slate-200 bg-white">
                            <div className="flex gap-2 flex-wrap mb-3">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={() => sendMessage(action.message)}
                                        disabled={isLoading}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-[#d97706] transition-colors disabled:opacity-50"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('placeholder')}
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
