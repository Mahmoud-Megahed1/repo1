import client from '@/lib/client';
import { AxiosRequestConfig } from 'axios';

export type ChatRule = {
    _id: string;
    keywords: string[];
    response: string;
    matchType: 'exact' | 'contains';
    priority: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateChatRuleDto = {
    keywords: string[];
    response: string;
    matchType: 'exact' | 'contains';
    priority: number;
    isActive: boolean;
};

export const getChatRules = (config?: AxiosRequestConfig) => {
    return client.get<ChatRule[]>('/admin/chat-rules', config);
};

export const createChatRule = (data: CreateChatRuleDto, config?: AxiosRequestConfig) => {
    return client.post<ChatRule>('/admin/chat-rules', data, config);
};

export const updateChatRule = (id: string, data: Partial<CreateChatRuleDto>, config?: AxiosRequestConfig) => {
    return client.patch<ChatRule>(`/admin/chat-rules/${id}`, data, config);
};

export const deleteChatRule = (id: string, config?: AxiosRequestConfig) => {
    return client.delete(`/admin/chat-rules/${id}`, config);
};
