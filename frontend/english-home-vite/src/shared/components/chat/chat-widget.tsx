import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'; // Assuming valid imports
import { Button } from '@ui/button'; // Adjust path
import { Input } from '@ui/input'; // Adjust path

import { useSupportChat, type ChatMessage } from '@hooks/use-support-chat';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@lib/utils';
import { useLocation } from '@tanstack/react-router'; // Or useLocation depending on router
// For rendering HTML safely (XSS protection)
import DOMPurify from 'dompurify';

import { useAuth } from '@shared/components/contexts/auth-context';

export function ChatWidget() {
    const auth = useAuth();
    // console.log('ChatWidget Rendered. Auth Context:', auth);
    const { user } = auth;
    const { isOpen, setIsOpen, messages, sendMessage, isSending, isLoading } = useSupportChat();
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation(); // Getting current path for dynamic chips

    // Hide if no user
    if (!user) return null;

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    // Dynamic Suggestion Chips Logic
    const getChips = () => {
        const path = location.pathname;
        if (path.includes('payment') || path.includes('subscription')) {
            return ['فشل في الدفع', 'خطط الاشتراك', 'سياسة الاسترداد'];
        }
        if (path.includes('lesson')) {
            return ['الصوت لا يعمل', 'المستوى التالي مغلق', 'الإبلاغ عن خطأ'];
        }
        return ['مشكلة تقنية', 'كيف أدرس؟', 'تواصل مع الدعم'];
    };

    const activeChips = getChips();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="border-border bg-card shadow-xl flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border md:w-[380px]"
                    >
                        {/* Header */}
                        <div className="bg-primary flex items-center justify-between p-4 text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 flex h-8 w-8 items-center justify-center rounded-full">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">مساعد Englishom</h3>
                                    <p className="text-[10px] text-white/80">
                                        يرد فوراً
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-white/20 h-8 w-8 text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={18} />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                            <div className="flex flex-col gap-4">
                                {isLoading && (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="text-muted-foreground animate-spin" />
                                    </div>
                                )}

                                {messages.map((msg, i) => (
                                    <MessageBubble key={i} message={msg} />
                                ))}

                                {isSending && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted text-muted-foreground max-w-[80%] rounded-2xl rounded-tl-none px-4 py-2 text-sm">
                                            <span className="animate-pulse">جاري الكتابة...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </div>

                        {/* Chips & Input Area */}
                        <div className="border-t p-3 bg-muted/30">
                            {/* Suggestion Chips */}
                            <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
                                {activeChips.map((chip) => (
                                    <button
                                        key={chip}
                                        onClick={() => sendMessage(chip)}
                                        disabled={isSending}
                                        className="border-primary/20 text-primary hover:bg-primary/10 whitespace-nowrap rounded-full border bg-white px-3 py-1 text-xs font-medium transition-colors dark:bg-zinc-900"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="flex items-center gap-2">
                                <Input
                                    className="rounded-full bg-white dark:bg-zinc-900"
                                    placeholder="اكتب رسالتك..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={isSending}
                                />
                                <Button
                                    size="icon"
                                    className={cn("h-10 w-10 shrink-0 rounded-full", isSending ? "opacity-50" : "")}
                                    onClick={handleSend}
                                    disabled={isSending || !inputValue.trim()}
                                >
                                    {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                className="bg-primary hover:bg-primary/90 shadow-primary/25 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageCircle size={28} />
            </motion.button>
        </div>
    );
}

// Sub-component for Message Bubble
function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.sender === 'user';
    const isAdmin = message.sender === 'admin'; // Future proof

    // Sanitize content before rendering to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(message.content);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex w-full",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "flex max-w-[80%] flex-col gap-1",
                isUser ? "items-end" : "items-start"
            )}>
                <div
                    className={cn(
                        "relative rounded-2xl px-4 py-2 text-sm shadow-sm",
                        isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted text-foreground rounded-tl-none border"
                    )}
                >
                    {/* Render HTML safely if bot sends links/formatting */}
                    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                </div>
                <span className="text-[10px] text-muted-foreground opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    );
}
