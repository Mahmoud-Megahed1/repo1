import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Loader2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for clsx/tailwind-merge

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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-cairo">
            {/* Chat Window */}
            <div
                className={cn(
                    "w-[350px] sm:w-[380px] bg-background border border-border rounded-xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col",
                    isOpen ? "opacity-100 scale-100 translate-y-0 h-[500px]" : "opacity-0 scale-95 translate-y-4 h-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center bg-[#EFBF04]">
                    <div className='flex items-center gap-2'>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h3 className="font-bold text-black">{i18n.language === 'ar' ? 'مساعد إنجلش هوم' : 'Englishom Assistant'}</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-black hover:bg-black/10" onClick={() => setIsOpen(false)}>
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-zinc-900/50">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "self-end bg-primary text-primary-foreground rounded-br-none bg-[#EFBF04] text-black"
                                        : "self-start bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-bl-none text-gray-800 dark:text-gray-100"
                                )}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                <span className="text-[10px] opacity-70 mt-1 block w-full text-end">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="self-start bg-white dark:bg-zinc-800 border rounded-2xl rounded-bl-none px-4 py-3">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-3 border-t bg-background flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={i18n.language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                        className="flex-1 focus-visible:ring-[#EFBF04]"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        size="icon"
                        className="bg-[#EFBF04] hover:bg-[#d9ad04] text-black"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110",
                    "bg-[#EFBF04] hover:bg-[#d9ad04] text-black border-2 border-white dark:border-zinc-800",
                    isOpen && "rotate-90 scale-0 opacity-0 absolute"
                )}
            >
                <MessageCircle className="h-8 w-8" />
            </Button>

            {/* Close Button (shows when open instead of toggle) */}
            <Button
                onClick={() => setIsOpen(false)}
                size="lg"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all absolute",
                    "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-zinc-800 dark:text-gray-300",
                    !isOpen && "scale-0 opacity-0 pointer-events-none"
                )}
            >
                <X className="h-6 w-6" />
            </Button>

        </div>
    );
};
