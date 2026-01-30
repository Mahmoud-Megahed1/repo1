import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Loader2, Minimize2 } from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Types
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const ChatWidget = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const initialMessageSent = useRef(false);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Initial greeting
    useEffect(() => {
        if (isOpen && !initialMessageSent.current && messages.length === 0) {
            initialMessageSent.current = true;
            const greeting = i18n.language === 'ar'
                ? 'مرحباً! أنا مساعد إنجلش هوم الذكي. كيف يمكنني مساعدتك اليوم بخصوص موقعنا؟'
                : 'Hello! I am the Englishom AI Assistant. How can I help you with our website today?';

            setMessages([
                {
                    id: 'init',
                    role: 'assistant',
                    content: greeting,
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen, i18n.language]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Robustly construct API URL
            let baseUrl = import.meta.env.VITE_API_URL || 'https://api.englishom.com';
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
            if (!baseUrl.endsWith('/api')) baseUrl += '/api';

            const response = await fetch(`${baseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMsg.content }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = i18n.language === 'ar'
                ? 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.'
                : 'Sorry, something went wrong. Please try again later.';

            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: errorMsg,
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-cairo" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Chat Window */}
            <div
                className={cn(
                    "w-[350px] sm:w-[380px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col",
                    isOpen ? "opacity-100 scale-100 translate-y-0 h-[500px]" : "opacity-0 scale-95 translate-y-4 h-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b bg-[#EFBF04] text-black flex justify-between items-center z-10 relative">
                    <div className='flex items-center gap-2'>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-2 ring-white/20" />
                        <h3 className="font-bold text-sm sm:text-base">{i18n.language === 'ar' ? 'مساعد إنجلش هوم' : 'Englishom Assistant'}</h3>
                    </div>
                    <button
                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Minimize2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Messages - Replacing ScrollArea with native implementation */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-zinc-950 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "self-end bg-[#EFBF04] text-black rounded-br-none" // User message
                                        : "self-start bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-bl-none text-gray-800 dark:text-gray-100" // Bot message
                                )}
                                style={{
                                    borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '1rem'
                                }}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                                <span className={cn(
                                    "text-[10px] opacity-60 mt-2 block w-full",
                                    msg.role === 'user' ? "text-right text-black/70" : "text-right text-gray-400"
                                )}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="self-start bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#EFBF04]" />
                                    <span className="text-xs text-gray-400">{i18n.language === 'ar' ? 'يكتب...' : 'Typing...'}</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-3 border-t bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 flex gap-2">
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={i18n.language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                        className="flex-1 bg-gray-100 dark:bg-zinc-800 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-[#EFBF04] focus:outline-none transition-all placeholder:text-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-[#EFBF04] hover:bg-[#d9ad04] text-black transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center z-50",
                    "bg-[#EFBF04] hover:bg-[#d9ad04] text-black border-2 border-white dark:border-zinc-800",
                    isOpen && "rotate-90 scale-0 opacity-0 absolute"
                )}
            >
                <MessageCircle className="h-7 w-7" />
            </button>

            {/* Close Button (shows when open instead of toggle) */}
            <button
                onClick={() => setIsOpen(false)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center absolute bottom-0 right-0 z-50",
                    "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-zinc-700 dark:text-gray-300",
                    !isOpen && "scale-0 opacity-0 pointer-events-none"
                )}
            >
                <X className="h-6 w-6" />
            </button>

        </div>
    );
};
