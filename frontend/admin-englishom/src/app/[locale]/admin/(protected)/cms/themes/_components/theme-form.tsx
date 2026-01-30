'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { createTheme, updateTheme } from '@/services/themes';
import { CreateThemeDto, Theme } from '@/types/themes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { z } from 'zod';
import client from '@/lib/client';

const themeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    startDate: z.date(),
    endDate: z.date(),
    isActive: z.boolean().default(true),
    assets: z.object({
        backgroundImage: z.string().optional(),
        logo: z.string().optional(),
    }),
    styles: z.object({
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
    }),
});

type ThemeFormValues = z.infer<typeof themeSchema>;

interface ThemeFormProps {
    initialData?: Theme;
}

export function ThemeForm({ initialData }: ThemeFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<ThemeFormValues>({
        resolver: zodResolver(themeSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                startDate: new Date(initialData.startDate),
                endDate: new Date(initialData.endDate),
                isActive: initialData.isActive,
                assets: initialData.assets || {},
                styles: initialData.styles || {},
            }
            : {
                name: '',
                isActive: true,
                assets: {},
                styles: {},
            },
    });

    const mutation = useMutation({
        mutationFn: async (values: ThemeFormValues) => {
            const data: CreateThemeDto = {
                ...values,
            };
            if (initialData) {
                return updateTheme(initialData._id, data);
            }
            return createTheme(data);
        },
        onSuccess: () => {
            toast.success(
                initialData
                    ? t('Global.updatedSuccessfully')
                    : t('Global.createdSuccessfully')
            );
            queryClient.invalidateQueries({ queryKey: ['themes'] });
            router.push('/admin/cms/themes');
        },
        onError: () => {
            toast.error(t('Global.somethingWentWrong'));
        },
    });

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await client.post<{ url: string }>('/files/single-file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
    };

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'backgroundImage' | 'logo'
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadFile(file);
                form.setValue(`assets.${field}`, url, { shouldDirty: true });
                toast.success(`${field} uploaded successfully`);
            } catch (error) {
                toast.error('File upload failed');
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Global.name')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>{t('Global.status')}</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t('Global.startDate')}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t('Global.endDate')}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Assets */}
                    <div className="col-span-full">
                        <h3 className="mb-4 text-lg font-medium">Assets</h3>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'backgroundImage')}
                                            className="hidden"
                                            id="bg-upload"
                                        />
                                        <Button type="button" variant="outline" onClick={() => document.getElementById('bg-upload')?.click()}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Background
                                        </Button>
                                        {form.watch('assets.backgroundImage') && (
                                            <img src={form.watch('assets.backgroundImage')} alt="Background" className="h-10 w-10 object-cover rounded" />
                                        )}
                                    </div>
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Logo</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'logo')}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Logo
                                        </Button>
                                        {form.watch('assets.logo') && (
                                            <img src={form.watch('assets.logo')} alt="Logo" className="h-10 w-10 object-contain" />
                                        )}
                                    </div>
                                </FormControl>
                            </FormItem>
                        </div>
                    </div>

                    {/* Styles */}
                    <div className="col-span-full">
                        <h3 className="mb-4 text-lg font-medium">Styles</h3>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="styles.primaryColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input {...field} type="color" className="w-12 p-1" />
                                                <Input {...field} placeholder="#000000" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="styles.secondaryColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secondary Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input {...field} type="color" className="w-12 p-1" />
                                                <Input {...field} placeholder="#000000" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                </div>

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? t('Global.save') : t('Global.create')}
                </Button>
            </form>
        </Form>
    );
}
