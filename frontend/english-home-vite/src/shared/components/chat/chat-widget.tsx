import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, Send, Loader2, Minimize2, RefreshCw, Bot } from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useChatStore } from '@hooks/use-chat-store';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ─── Types ───────────────────────────────────────────
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'error';
}

// ─── Simple Markdown Renderer ────────────────────────
function renderMarkdown(text: string): React.ReactNode {
    // Split by newlines and process each line
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
        // Bold: **text**
        const parts: React.ReactNode[] = [];
        const boldRegex = /\*\*(.+?)\*\*/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = boldRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                parts.push(line.slice(lastIndex, match.index));
            }
            parts.push(<strong key={`b-${lineIndex}-${match.index}`}>{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < line.length) {
            parts.push(line.slice(lastIndex));
        }

        // Bullet points
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            elements.push(
                <div key={lineIndex} className="flex gap-1.5 ms-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{parts.length > 0 ? parts : trimmed.slice(2)}</span>
                </div>
            );
        } else if (trimmed === '') {
            elements.push(<br key={lineIndex} />);
        } else {
            elements.push(
                <span key={lineIndex}>
                    {parts.length > 0 ? parts : line}
                    {lineIndex < lines.length - 1 && <br />}
                </span>
            );
        }
    });

    return <>{elements}</>;
}

// ─── Main Component ──────────────────────────────────
export const ChatWidget = () => {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { isOpen, setIsOpen } = useChatStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const initialMessageSent = useRef(false);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Greeting
    useEffect(() => {
        if (isOpen && !initialMessageSent.current && messages.length === 0) {
            initialMessageSent.current = true;
            const greeting = isArabic
                ? 'مرحباً! 👋 أنا مساعد إنجلش هوم الذكي. كيف يمكنني مساعدتك اليوم؟'
                : 'Hello! 👋 I\'m the Englishom AI Assistant. How can I help you today?';

            setMessages([{
                id: 'init',
                role: 'assistant',
                content: greeting,
                timestamp: new Date(),
                status: 'sent',
            }]);
        }
    }, [isOpen, isArabic]);

    const handleSendMessage = useCallback(async (retryMessage?: string) => {
        const messageText = retryMessage || inputValue.trim();
        if (!messageText || isLoading) return;

        const userMsgId = Date.now().toString();
        const userMsg: Message = {
            id: userMsgId,
            role: 'user',
            content: messageText,
            timestamp: new Date(),
            status: 'sent',
        };

        if (!retryMessage) {
            setMessages(prev => [...prev, userMsg]);
            setInputValue('');
        }
        setIsLoading(true);

        try {
            let baseUrl = import.meta.env.VITE_API_URL || 'https://api.englishom.com';
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
            if (!baseUrl.endsWith('/api')) baseUrl += '/api';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch(`${baseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            if (!data.reply) throw new Error('Empty reply');

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                timestamp: new Date(),
                status: 'sent',
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error('Chat error:', error);

            let errorContent: string;
            if (error.name === 'AbortError') {
                errorContent = isArabic
                    ? 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.'
                    : 'Connection timed out. Please try again.';
            } else {
                errorContent = isArabic
                    ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
                    : 'Sorry, something went wrong. Please try again.';
            }

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: errorContent,
                timestamp: new Date(),
                status: 'error',
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, isArabic]);

    const handleRetry = useCallback((errorMsgIndex: number) => {
        // Find the user message before this error
        let userMessage = '';
        for (let i = errorMsgIndex - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                userMessage = messages[i].content;
                break;
            }
        }
        if (!userMessage) return;

        // Remove error message
        setMessages(prev => prev.filter((_, i) => i !== errorMsgIndex));
        // Retry
        handleSendMessage(userMessage);
    }, [messages, handleSendMessage]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return createPortal(
        <div className="fixed bottom-10 sm:bottom-36 end-4 sm:end-6 z-[100] flex flex-col items-end gap-2 font-cairo pointer-events-none" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Chat Window */}
            <div
                className={cn(
                    "w-[calc(100vw-32px)] sm:w-[400px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col pointer-events-auto",
                    isOpen ? "opacity-100 scale-100 translate-y-0 h-[500px] sm:h-[520px]" : "opacity-0 scale-95 translate-y-4 h-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-[#EFBF04] to-[#f5d44a] text-black flex justify-between items-center z-10 relative">
                    <div className='flex items-center gap-3'>
                        <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{isArabic ? 'مساعد إنجلش هوم' : 'Englishom Assistant'}</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                <span className="text-[11px] text-black/60">{isArabic ? 'متصل الآن' : 'Online now'}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Minimize2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-zinc-950 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
                    <div className="flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-200",
                                    msg.role === 'user'
                                        ? "self-end bg-[#EFBF04] text-black rounded-br-sm"
                                        : cn(
                                            "self-start bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-bl-sm text-gray-800 dark:text-gray-100",
                                            msg.status === 'error' && "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
                                        )
                                )}
                            >
                                <div className="whitespace-pre-wrap leading-relaxed text-sm">
                                    {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className={cn(
                                        "text-[10px] opacity-50",
                                        msg.role === 'user' ? "text-black" : "text-gray-400"
                                    )}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    {msg.status === 'error' && (
                                        <button
                                            onClick={() => handleRetry(idx)}
                                            className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-medium"
                                        >
                                            <RefreshCw size={10} />
                                            {isArabic ? 'إعادة' : 'Retry'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="self-start bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#EFBF04]" />
                                    <span className="text-xs text-gray-400">{isArabic ? 'يكتب...' : 'Typing...'}</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 flex gap-2">
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                        className="flex-1 bg-gray-100 dark:bg-zinc-800 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-[#EFBF04] focus:outline-none transition-all placeholder:text-gray-400 h-10"
                        disabled={isLoading}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isLoading}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-[#EFBF04] hover:bg-[#d9ad04] text-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>

                {/* Footer badge */}
                <div className="text-center py-1.5 text-[10px] text-gray-400 bg-gray-50 dark:bg-zinc-950">
                    {isArabic ? 'مدعوم بالذكاء الاصطناعي ✨' : 'Powered by AI ✨'}
                </div>
            </div>

            {/* Removed the floating toggle button since it's now in the sidebar */}
            {/* <button
                onClick={() => setIsOpen(!isOpen)}
                ...
            </button> */}

            {/* Close Button */}
            <button
                onClick={() => setIsOpen(false)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center absolute bottom-0 end-0 z-50 pointer-events-auto",
                    "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-zinc-700 dark:text-gray-300",
                    !isOpen && "scale-0 opacity-0 pointer-events-none"
                )}
            >
                <X className="h-6 w-6" />
            </button>
        </div>,
        document.body
    );
};
