import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@lib/axios-client';
import { useEffect, useState } from 'react';

export type ChatMessage = {
    sender: 'user' | 'bot' | 'admin';
    content: string;
    intent: string;
    timestamp: string;
};

export type ChatConversation = {
    messages: ChatMessage[];
    isActive: boolean;
};

// API Functions
const fetchHistory = async () => {
    const res = await axiosClient.get<ChatConversation>('/support-chat/history');
    return res.data;
};

const sendMessage = async (content: string) => {
    const res = await axiosClient.post<ChatConversation>('/support-chat/send', { content });
    return res.data;
};

// Hook
export function useSupportChat() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Persist open state
    useEffect(() => {
        const saved = localStorage.getItem('chat_is_open');
        if (saved) setIsOpen(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('chat_is_open', JSON.stringify(isOpen));
    }, [isOpen]);

    const { data: conversation, isLoading } = useQuery({
        queryKey: ['support-chat-history'],
        queryFn: fetchHistory,
        // Only fetch when open or to check unread (future)
        staleTime: 1000 * 60 * 5, // 5 mins
        refetchOnWindowFocus: false,
    });

    const { mutate: send, isPending: isSending } = useMutation({
        mutationFn: sendMessage,
        onSuccess: (newConversation) => {
            queryClient.setQueryData(['support-chat-history'], newConversation);
        },
    });

    return {
        isOpen,
        setIsOpen,
        messages: conversation?.messages || [],
        isLoading,
        sendMessage: send,
        isSending,
    };
}
