'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ChatRule, createChatRule, updateChatRule } from '@/services/chat-rules';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';

const ruleSchema = z.object({
    keywords: z.string().min(1, 'At least one keyword required'),
    response: z.string().min(1, 'Response is required'),
    matchType: z.enum(['exact', 'contains']),
    priority: z.coerce.number().min(0).default(0),
    isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof ruleSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleToEdit?: ChatRule;
}

export function RuleFormDialog({ open, onOpenChange, ruleToEdit }: Props) {
    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(ruleSchema),
        defaultValues: {
            keywords: '',
            response: '',
            matchType: 'contains',
            priority: 0,
            isActive: true,
        },
    });

    useEffect(() => {
        if (ruleToEdit) {
            form.reset({
                keywords: ruleToEdit.keywords.join(', '),
                response: ruleToEdit.response,
                matchType: ruleToEdit.matchType,
                priority: ruleToEdit.priority,
                isActive: ruleToEdit.isActive,
            });
        } else {
            form.reset({
                keywords: '',
                response: '',
                matchType: 'contains',
                priority: 0,
                isActive: true,
            });
        }
    }, [ruleToEdit, form, open]);

    const { mutate, isPending } = useMutation({
        mutationFn: (values: FormValues) => {
            const payload = {
                ...values,
                keywords: values.keywords.split(',').map((k) => k.trim()).filter(Boolean),
            };
            if (ruleToEdit) {
                return updateChatRule(ruleToEdit._id, payload);
            }
            return createChatRule(payload);
        },
        onSuccess: () => {
            toast.success(ruleToEdit ? 'Rule updated' : 'Rule created');
            queryClient.invalidateQueries({ queryKey: ['chat-rules'] });
            onOpenChange(false);
        },
        onError: (err: unknown) => {
            toast.error('Error', {
                description: (err as any).response?.data?.message || 'Something went wrong',
            });
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{ruleToEdit ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keywords (comma separated)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="price, cost, how much" />
                                    </FormControl>
                                    <FormDescription>
                                        For &apos;exact&apos;, match is strict. For &apos;contains&apos;, any of these words triggers response.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="response"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bot Response</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="The price is $10..." rows={4} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="matchType"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Match Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="contains">Contains (Partial)</SelectItem>
                                                <SelectItem value="exact">Exact (Full String)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem className="w-24">
                                        <FormLabel>Priority</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" min={0} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Active Status</FormLabel>
                                        <FormDescription>
                                            Enable or disable this rule immediately.
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

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Rule'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
