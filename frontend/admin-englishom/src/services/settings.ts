import client from '@/lib/client';

export type SettingsData = {
  _id: string;
  repurchaseDiscounts: number[];
};

export const getSettings = () => {
  return client.get<SettingsData>('/settings');
};

export const updateSettings = (data: { repurchaseDiscounts: number[] }) => {
  return client.patch<SettingsData>('/settings', data);
};
