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
import { Mic, Bot, User, StopCircle, Volume2, Send, RefreshCw, Loader2, Keyboard } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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
    status?: 'sending' | 'sent' | 'error';
};

// ─── Speech Recognition (cross-browser) ─────────────────────
function getSpeechRecognition(): any {
    if (typeof window === 'undefined') return null;
    const w = window as any;
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function AIReviewChat({
    open,
    onOpenChange,
    levelName,
    day,
    lessonName,
}: Props) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language.startsWith('ar');

    const [speechLang, setSpeechLang] = useState<'ar-SA' | 'en-US'>(isArabic ? 'ar-SA' : 'en-US');

    useEffect(() => {
        setSpeechLang(isArabic ? 'ar-SA' : 'en-US');
    }, [isArabic]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [textInput, setTextInput] = useState('');
    const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ttsAbortControllerRef = useRef<AbortController | null>(null);

    // ─── TTS ─────────────────────────────────────────
    const speak = useCallback(async (text: string, index: number) => {
        try {
            // Stop any current audio and abort pending fetch
            if (ttsAbortControllerRef.current) {
                ttsAbortControllerRef.current.abort();
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            const cleanText = text
                .replace(/[#*`_]/g, '') // Remove markdown symbols
                .replace(/\n\s*\n/g, '. ') // Replace double newlines with pause
                .trim();

            if (!cleanText) return;

            setMessages(prev => prev.map((m, i) =>
                i === index ? { ...m, isAudioPlaying: true } : { ...m, isAudioPlaying: false }
            ));

            const controller = new AbortController();
            ttsAbortControllerRef.current = controller;

            const res = await axiosClient.post('/chat/tts', { text: cleanText }, {
                responseType: 'blob',
                signal: controller.signal
            });

            if (!res.data || res.data.size < 100) {
                console.error("Invalid blob size:", res.data?.size);
                throw new Error('Invalid audio data received');
            }

            const blob = res.data;
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.volume = 1.0; // Ensure max standard volume
            audioRef.current = audio;

            // Optional: Web Audio API Boost (Useful if OpenAI output is naturally quiet)
            try {
                const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
                if (AudioContextClass) {
                    const audioCtx = new AudioContextClass();
                    const source = audioCtx.createMediaElementSource(audio);
                    const gainNode = audioCtx.createGain();
                    gainNode.gain.value = 3.0; // 200% boost (3x volume)
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                }
            } catch (err) {
                console.warn("Audio boost failed, using default:", err);
            }

            // Preload to ensure metadata is there
            audio.load();

            audio.onended = () => {
                setMessages(prev => prev.map((m, i) =>
                    i === index ? { ...m, isAudioPlaying: false } : m
                ));
                audioRef.current = null;
                URL.revokeObjectURL(url);
            };

            audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                // toast.error(isArabic ? 'خطأ في تشغيل الصوت' : 'Audio playback error');
                setMessages(prev => prev.map((m, i) =>
                    i === index ? { ...m, isAudioPlaying: false } : m
                ));
                audioRef.current = null;
                URL.revokeObjectURL(url);
            };

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Autoplay/Play prevented:", error);
                    // If blocked, we reset the playing state
                    setMessages(prev => prev.map((m, i) =>
                        i === index ? { ...m, isAudioPlaying: false } : m
                    ));
                    // Maybe prompt user to click? 
                    toast.info(isArabic ? 'انقر على أيقونة الصوت للاستماع' : 'Click the volume icon to listen');
                });
            }
        } catch (error: any) {
            if (error.name === 'CanceledError' || error.name === 'AbortError') return;
            console.error('TTS Error:', error);
            // toast.error(isArabic ? 'فشل تحميل الصوت' : 'Failed to load audio');
            setMessages(prev => prev.map((m, i) =>
                i === index ? { ...m, isAudioPlaying: false } : m
            ));
        } finally {
            ttsAbortControllerRef.current = null;
        }
    }, [isArabic]);

    const stopSpeaking = useCallback(() => {
        if (ttsAbortControllerRef.current) {
            ttsAbortControllerRef.current.abort();
            ttsAbortControllerRef.current = null;
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setMessages(prev => prev.map(m => ({ ...m, isAudioPlaying: false })));
    }, []);

    // ─── Auto-scroll ──────────────────────────────────
    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 50);
        }
    }, [messages]);

    // ─── Load history / greeting ──────────────────────
    useEffect(() => {
        if (open) {
            const fetchHistory = async () => {
                try {
                    const res = await axiosClient.get<any[]>('/chat/lesson-review', {
                        params: { levelName, day, lessonName }
                    });

                    if (res.data && res.data.length > 0) {
                        const historyMessages: Message[] = res.data.map(m => ({
                            role: m.role,
                            content: m.content,
                            isAudioPlaying: false,
                            status: 'sent' as const,
                        }));
                        setMessages(historyMessages);
                    } else {
                        const greeting = isArabic
                            ? "مرحباً! 🎉 أحسنت على إكمال الدرس. أنا مُعلّمك الذكي وسأراجع معك ما تعلمته حول ( " + (lessonName.replace(/_/g, ' ')) + " ). يمكنك الكتابة أو استخدام الميكروفون للتحدث معي.\n\nاضغط على زر الميكروفون بالأسفل للتحدث، أو استخدم لوحة المفاتيح."
                            : "Hello! 🎉 Great job completing the lesson! I'm your AI tutor and I'll help you review " + (lessonName.replace(/_/g, ' ')) + ". You can type or use the microphone to talk to me.\n\nTap the microphone below to speak, or use the keyboard.";
                        const initialMsg: Message = { role: 'assistant', content: greeting, status: 'sent' };
                        setMessages([initialMsg]);
                        speak(greeting, 0);
                    }
                } catch (error) {
                    console.error("Failed to fetch chat history", error);
                    const greeting = isArabic
                        ? "مرحباً! أنا هنا لمراجعة الدرس معك. اضغط على الميكروفون للتحدث أو اكتب رسالتك."
                        : "Hello! I'm here to review the lesson with you. Tap the microphone or type your message.";
                    setMessages([{ role: 'assistant', content: greeting, status: 'sent' }]);
                }
            };

            fetchHistory();
        } else {
            stopSpeaking();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, levelName, day, lessonName, isArabic]);

    // ─── Send Message ─────────────────────────────────
    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isProcessing) return;

        const userMsg: Message = { role: 'user', content: text.trim(), status: 'sent' };
        setMessages(prev => [...prev, userMsg]);
        setTextInput('');
        setIsProcessing(true);

        try {
            console.log("Sending message to AI:", text.trim());
            const res = await axiosClient.post<{ reply: string }>('/chat/lesson-review', {
                message: text.trim(),
                levelName,
                day,
                lessonName
            });

            const reply = res.data.reply;
            if (reply) {
                const newBotMsg: Message = { role: 'assistant', content: reply, status: 'sent' };
                setMessages(prev => [...prev, newBotMsg]);

                // Speak the reply. 
                // Since we just added a message to 'prev', the index will be 'messages.length' (current state).
                setTimeout(() => speak(reply, messages.length), 100);
            } else {
                throw new Error('Empty reply from AI');
            }
        } catch (error: any) {
            console.error("AI Error", error);

            const errorMsg = isArabic
                ? "عذراً، لم أتمكن من الرد الآن. يرجى المحاولة مرة أخرى."
                : "Sorry, I couldn't respond right now. Please try again.";

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMsg,
                status: 'error',
            }]);

            toast.error(isArabic ? 'فشل الاتصال بالذكاء الاصطناعي' : 'Failed to get AI response');
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing, levelName, day, lessonName, isArabic, speak, messages]);

    // ─── Retry failed message ─────────────────────────
    const handleRetry = useCallback((failedIndex: number) => {
        // Find the last user message before the failed assistant message
        let userMessage = '';
        for (let i = failedIndex - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                userMessage = messages[i].content;
                break;
            }
        }
        if (!userMessage) return;

        // Remove the failed message
        setMessages(prev => prev.filter((_, i) => i !== failedIndex));
        // Retry
        handleSendMessage(userMessage);
    }, [messages, handleSendMessage]);

    // ─── Speech Recognition ──────────────────────────
    const hasSpeechRecognition = !!getSpeechRecognition();

    const startListening = useCallback(() => {
        const SpeechRecognitionClass = getSpeechRecognition();
        if (!SpeechRecognitionClass) {
            toast.error(isArabic
                ? 'التعرف على الكلام غير مدعوم في هذا المتصفح. استخدم الكتابة بدلاً من ذلك.'
                : 'Speech recognition is not supported in this browser. Please type instead.');
            setInputMode('text');
            return;
        }

        stopSpeaking();

        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true; // Show results in real-time
        recognition.maxAlternatives = 1;
        recognition.lang = speechLang || (isArabic ? 'ar-SA' : 'en-US');

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (interim) {
                setInterimTranscript(interim);
            }

            if (finalTranscript.trim()) {
                console.log("Speech detected:", finalTranscript);
                setInterimTranscript('');
                handleSendMessage(finalTranscript);
                recognition.stop();
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);

            // Handle transient network errors
            if (event.error === 'network') {
                console.warn("Speech network error - keep trying...");
                // Don't kill the listening state immediately, wait for onend to reset or retry
                return;
            }

            setIsListening(false);
            setInterimTranscript('');

            if (event.error === 'no-speech') {
                // Silent timeout
            } else if (event.error !== 'aborted') {
                toast.error(`${isArabic ? 'خطأ:' : 'Error:'} ${event.error}`);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
            setIsListening(true);
        } catch {
            toast.error(isArabic ? 'فشل تشغيل الميكروفون' : 'Failed to start microphone');
        }
    }, [isArabic, stopSpeaking, handleSendMessage, speechLang]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.abort();
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    // ─── Keyboard handler ─────────────────────────────
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(textInput);
        }
    };

    // ─── Cleanup on close ─────────────────────────────
    useEffect(() => {
        return () => {
            stopListening();
            stopSpeaking();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Render ───────────────────────────────────────
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[85vh] sm:h-[650px] sm:max-w-lg mx-auto rounded-t-2xl sm:rounded-xl p-0 flex flex-col overflow-hidden">
                {/* Header */}
                <SheetHeader className="px-5 py-4 border-b bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    <SheetTitle className="flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                        {t('Global.aiReview.title', 'AI Lesson Review')}
                    </SheetTitle>
                    <SheetDescription className="text-white/80">
                        {t('Global.aiReview.description', 'Chat with AI to review what you learned.')}
                    </SheetDescription>
                </SheetHeader>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="flex flex-col gap-4 pb-4">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-2.5 max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    m.role === 'user' ? "self-end flex-row-reverse" : "self-start"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                    m.role === 'assistant'
                                        ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                                        : "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                                )}>
                                    {m.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                                </div>

                                {/* Bubble */}
                                <div className={cn(
                                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    m.role === 'user'
                                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-tr-sm"
                                        : "bg-muted rounded-tl-sm",
                                    m.status === 'error' && "border-2 border-destructive/30 bg-destructive/5"
                                )}>
                                    <p className="whitespace-pre-wrap">{m.content}</p>

                                    {/* Error retry button */}
                                    {m.status === 'error' && (
                                        <button
                                            onClick={() => handleRetry(i)}
                                            className="mt-2 flex items-center gap-1.5 text-xs text-destructive hover:underline font-medium"
                                        >
                                            <RefreshCw size={12} />
                                            {isArabic ? 'إعادة المحاولة' : 'Retry'}
                                        </button>
                                    )}
                                </div>

                                {/* TTS button for assistant */}
                                {m.role === 'assistant' && m.status !== 'error' && (
                                    <button
                                        onClick={() => m.isAudioPlaying ? stopSpeaking() : speak(m.content, i)}
                                        className="text-muted-foreground hover:text-foreground self-end transition-colors p-1"
                                        title={isArabic ? 'استمع' : 'Listen'}
                                    >
                                        {m.isAudioPlaying
                                            ? <StopCircle size={16} className="animate-pulse text-red-500" />
                                            : <Volume2 size={16} />
                                        }
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isProcessing && (
                            <div className="flex items-center gap-2.5 self-start animate-in fade-in">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-sm">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:150ms]" />
                                            <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:300ms]" />
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {isArabic ? 'الذكاء الاصطناعي يفكر...' : 'AI is thinking...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Listening indicator */}
                        {isListening && (
                            <div className="flex items-center gap-2 self-center text-sm text-muted-foreground animate-pulse">
                                <Mic size={16} className="text-red-500" />
                                {isArabic ? 'جاري الاستماع...' : 'Listening...'}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <SheetFooter className="p-3 border-t bg-background/95 backdrop-blur-sm">
                    {isListening && (
                        <div className="absolute -top-16 left-0 right-0 p-3 bg-blue-50/90 border border-blue-200 rounded-lg text-sm text-blue-700 animate-pulse text-center mx-4 shadow-sm z-10">
                            {interimTranscript || (isArabic ? 'أنا أسمعك الآن... تكلم' : 'Hearing you now... Speak')}
                        </div>
                    )}

                    <div className="flex items-center gap-2 w-full">
                        {/* Voice/Text toggle */}
                        {hasSpeechRecognition && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="shrink-0 h-10 w-10 rounded-full"
                                onClick={() => setInputMode(prev => prev === 'voice' ? 'text' : 'voice')}
                                title={inputMode === 'voice'
                                    ? (isArabic ? 'التبديل للكتابة' : 'Switch to typing')
                                    : (isArabic ? 'التبديل للصوت' : 'Switch to voice')
                                }
                            >
                                {inputMode === 'voice' ? <Keyboard size={18} /> : <Mic size={18} />}
                            </Button>
                        )}

                        {inputMode === 'text' || !hasSpeechRecognition ? (
                            /* Text input mode */
                            <>
                                <input
                                    ref={inputRef}
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                                    className="flex-1 h-10 bg-muted rounded-full px-4 text-sm border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-muted-foreground/60"
                                    disabled={isProcessing}
                                    dir={isArabic ? 'rtl' : 'ltr'}
                                />
                                <Button
                                    size="icon"
                                    className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md disabled:opacity-50"
                                    onClick={() => handleSendMessage(textInput)}
                                    disabled={!textInput.trim() || isProcessing}
                                >
                                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </Button>
                            </>
                        ) : (
                            /* Voice input mode */
                            <div className="flex-1 flex justify-center relative">
                                <Button
                                    size="lg"
                                    variant={isListening ? "outline" : "default"}
                                    className={cn(
                                        "rounded-full w-14 h-14 p-0 shadow-lg transition-all duration-300",
                                        isListening
                                            ? "ring-4 ring-red-500/30 bg-red-50 dark:bg-red-950 border-red-300 scale-110"
                                            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:scale-105"
                                    )}
                                    onClick={isListening ? stopListening : startListening}
                                    disabled={isProcessing}
                                >
                                    {isListening
                                        ? <StopCircle className="w-7 h-7 text-red-500 animate-pulse" />
                                        : <Mic className="w-7 h-7" />
                                    }
                                </Button>

                                {/* Language Toggle */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full px-3 text-xs font-semibold bg-muted/50 hover:bg-muted text-muted-foreground"
                                    onClick={() => setSpeechLang(prev => prev === 'en-US' ? 'ar-SA' : 'en-US')}
                                    title={isArabic ? 'تغيير لغة التحدث' : 'Change speaking language'}
                                >
                                    {speechLang === 'en-US' ? '🇺🇸 EN' : '🇸🇦 AR'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Helper text */}
                    <p className="text-[10px] text-muted-foreground/60 text-center mt-1 w-full">
                        {isArabic ? 'مدعوم بالذكاء الاصطناعي • يمكنك الكتابة أو التحدث' : 'Powered by AI • Type or speak'}
                    </p>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
