'use client';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChatRules } from '@/services/chat-rules';
import { columns } from './columns';
import { RuleFormDialog } from './rule-form-dialog';
import { useTranslations } from 'next-intl';

export default function ChatRulesPage() {
    const t = useTranslations('Admin.chatRules');
    const [open, setOpen] = useState(false);
    const { data: rules, isLoading } = useQuery({
        queryKey: ['chat-rules'],
        queryFn: () => getChatRules().then((res) => res.data),
    });

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="heading">{t('title')}</h1>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 size-4" /> {t('addRule')}
                </Button>
            </div>

            <div className="box">
                {isLoading ? (
                    <div>{t('loading')}</div>
                ) : (
                    <DataTable columns={columns(t)} data={rules || []} />
                )}
            </div>

            <RuleFormDialog open={open} onOpenChange={setOpen} />
        </div>
    );
}
