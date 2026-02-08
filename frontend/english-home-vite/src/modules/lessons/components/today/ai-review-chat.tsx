import { Button } from '@ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@ui/sheet';
import { ScrollArea } from '@ui/scroll-area';
import { cn } from '@lib/utils';
import axiosClient from '@lib/axios-client';
import { Mic, Bot, User, StopCircle, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LevelId, LessonId } from '@shared/types/entities';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    levelName: LevelId;
    day: string;
    lessonName: LessonId;
};

type Message = {
    role: 'user' | 'assistant';
    content: string;
    isAudioPlaying?: boolean;
};

export default function AIReviewChat({
    open,
    onOpenChange,
    levelName,
    day,
    lessonName,
}: Props) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Speech Synthesis
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSynth(window.speechSynthesis);
        }
    }, []);

    const speak = (text: string, index: number) => {
        if (!synth) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        // Dynamic language: Arabic or English based on user preference
        utterance.lang = isArabic ? 'ar-SA' : 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.onstart = () => {
            setMessages(prev => prev.map((m, i) => i === index ? { ...m, isAudioPlaying: true } : { ...m, isAudioPlaying: false }));
        };
        utterance.onend = () => {
            setMessages(prev => prev.map((m, i) => i === index ? { ...m, isAudioPlaying: false } : m));
        };
        synth.speak(utterance);
    };

    const stopSpeaking = () => {
        if (synth) {
            synth.cancel();
            setMessages(prev => prev.map(m => ({ ...m, isAudioPlaying: false })));
        }
    };

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Initial Load & Greeting
    useEffect(() => {
        if (open) {
            const fetchHistory = async () => {
                try {
                    const res = await axiosClient.get<any[]>('/chat/lesson-review', {
                        params: { levelName, day, lessonName }
                    });

                    if (res.data && res.data.length > 0) {
                        // Map backend history to frontend messages
                        const historyMessages: Message[] = res.data.map(m => ({
                            role: m.role,
                            content: m.content,
                            isAudioPlaying: false
                        }));
                        setMessages(historyMessages);
                        // Scroll to bottom after loading history
                        setTimeout(() => {
                            if (scrollRef.current) {
                                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                            }
                        }, 100);
                    } else {
                        // No history, show greeting
                        const greeting = isArabic
                            ? "مرحباً! أحسنت على إكمال الدرس. أنا هنا لمراجعة ما تعلمته. كيف كان الدرس بالنسبة لك؟"
                            : "Hello! Great job completing the lesson. I'm here to review what you've learned. How was the lesson for you?";
                        const initialMsg: Message = { role: 'assistant', content: greeting };
                        setMessages([initialMsg]);
                        speak(greeting, 0);
                    }
                } catch (error) {
                    console.error("Failed to fetch chat history", error);
                    // Fallback to greeting on error
                    const greeting = isArabic
                        ? "مرحباً! أحسنت على إكمال الدرس. أنا هنا لمراجعة ما تعلمته. كيف كان الدرس بالنسبة لك؟"
                        : "Hello! Great job completing the lesson. I'm here to review what you've learned. How was the lesson for you?";
                    setMessages([{ role: 'assistant', content: greeting }]);
                }
            };

            fetchHistory();
        } else {
            stopSpeaking();
        }
    }, [open, levelName, day, lessonName, isArabic]);

    const handleSendMessage = async (text: string) => {
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setIsProcessing(true);

        try {
            const res = await axiosClient.post<{ reply: string }>('/chat/lesson-review', {
                message: text,
                levelName,
                day,
                lessonName
            });

            const reply = res.data.reply;
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            speak(reply, messages.length + 2);

        } catch (error) {
            console.error("AI Error", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in (window as any)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            const recog = new SpeechRecognition();
            recog.continuous = false;
            // Dynamic language for speech recognition
            recog.lang = isArabic ? 'ar-SA' : 'en-US';
            recog.interimResults = false;

            recog.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                handleSendMessage(transcript);
            };

            recog.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsProcessing(false);
                if (event.error === 'network') {
                    alert(t('Global.errors.networkError', 'Network error. Please check your connection or VPN.'));
                } else if (event.error === 'not-allowed') {
                    alert(t('Global.errors.micPermission', 'Microphone permission denied.'));
                } else {
                    alert(t('Global.errors.speechError', 'Speech recognition error: ') + event.error);
                }
            };

            setRecognition(recog);
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) {
            alert("Speech Recognition not supported in this browser.");
            return;
        }
        if (isProcessing) return;
        stopSpeaking();
        try {
            recognition.start();
            setIsProcessing(true);
        } catch (e) {
            // already started
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[80vh] sm:h-[600px] sm:max-w-md mx-auto rounded-t-xl sm:rounded-xl p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        {t('Global.aiReview.title', 'AI Lesson Review')}
                    </SheetTitle>
                    <SheetDescription>
                        {t('Global.aiReview.description', 'Chat with AI to review what you learned.')}
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="flex flex-col gap-4 pb-4">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    m.role === 'user' ? "self-end flex-row-reverse" : "self-start"
                                )}
                            >
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    m.role === 'assistant' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                                    {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className={cn("p-3 rounded-2xl text-sm",
                                    m.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none")}>
                                    {m.content}
                                </div>
                                {m.role === 'assistant' && (
                                    <button onClick={() => m.isAudioPlaying ? stopSpeaking() : speak(m.content, i)} className="text-muted-foreground hover:text-foreground self-center">
                                        {m.isAudioPlaying ? <StopCircle size={16} className="animate-pulse text-red-500" /> : <Volume2 size={16} />}
                                    </button>
                                )}
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm ms-4">
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <SheetFooter className="p-4 border-t bg-background flex sm:justify-center">
                    <Button
                        size="lg"
                        variant={isProcessing ? "outline" : "default"}
                        className={cn("rounded-full w-16 h-16 p-0 shadow-lg transition-all", isProcessing && "scale-110 ring-4 ring-primary/20")}
                        onClick={toggleListening}
                        disabled={isProcessing}
                    >
                        <Mic className={cn("w-8 h-8", isProcessing && "animate-pulse")} />
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
