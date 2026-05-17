'use client';
import { useTranslations } from 'next-intl';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TestimonialFormValues } from './schema';

interface Props {
    id?: string;
    form: UseFormReturn<TestimonialFormValues>;
    onSubmit: () => Promise<void>;
}

const TestimonialForm: FC<Props> = ({ form, id, onSubmit }) => {
    const t = useTranslations('Admin.testimonials');
    return (
        <Form {...form}>
            <form
                id={id}
                onSubmit={onSubmit}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('formName')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('formNamePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('formRole')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('formRolePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('formRating')}</FormLabel>
                            <FormControl>
                                <Input type="number" min={1} max={5} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('formOrder')}</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>{t('formOrderDescription')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="col-span-1 md:col-span-2">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('formContent')}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={t('formContentPlaceholder')}
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isVisible"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">{t('formVisibility')}</FormLabel>
                                <FormDescription>
                                    {t('formVisibilityDescription')}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default TestimonialForm;
