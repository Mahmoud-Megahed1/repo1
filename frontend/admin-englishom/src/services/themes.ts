import { CreateThemeDto, UpdateThemeDto, Theme } from '@/types/themes';
import client from '@/lib/client';

export const getThemes = async () => {
    return client.get<Theme[]>('/themes');
};

export const getTheme = async (id: string) => {
    return client.get<Theme>(`/themes/${id}`);
};

export const createTheme = async (data: CreateThemeDto) => {
    return client.post<Theme>('/themes', data);
};

export const updateTheme = async (id: string, data: UpdateThemeDto) => {
    return client.patch<Theme>(`/themes/${id}`, data);
};

export const deleteTheme = async (id: string) => {
    return client.delete<Theme>(`/themes/${id}`);
};
