'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatRule, deleteChatRule } from '@/services/chat-rules';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { RuleFormDialog } from './rule-form-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export const columns = (t: any): ColumnDef<ChatRule>[] => [
    {
        accessorKey: 'priority',
        header: t('priority'),
        cell: ({ row }) => <span className="font-bold">{row.original.priority}</span>,
    },
    {
        accessorKey: 'keywords',
        header: t('keywords'),
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.keywords.map((k, i) => (
                    <Badge key={i} variant="secondary">
                        {k}
                    </Badge>
                ))}
            </div>
        ),
    },
    {
        accessorKey: 'matchType',
        header: t('matchType'),
        cell: ({ row }) => (
            <Badge variant={row.original.matchType === 'exact' ? 'destructive' : 'default'}>
                {row.original.matchType === 'exact' ? t('exact') : t('contains')}
            </Badge>
        ),
    },
    {
        accessorKey: 'response',
        header: t('response'),
        cell: ({ row }) => <div className="max-w-[400px] truncate" title={row.original.response}>{row.original.response}</div>,
    },
    {
        accessorKey: 'isActive',
        header: t('status'),
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? 'outline' : 'secondary'}>
                {row.original.isActive ? t('active') : t('inactive')}
            </Badge>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionCell rule={row.original} t={t} />,
    },
];

const ActionCell = ({ rule, t }: { rule: ChatRule; t: any }) => {
    const [editOpen, setEditOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: deleteMutate } = useMutation({
        mutationFn: () => deleteChatRule(rule._id),
        onSuccess: () => {
            toast.success(t('ruleDeleted'));
            queryClient.invalidateQueries({ queryKey: ['chat-rules'] });
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                            if (confirm(t('confirmDelete'))) deleteMutate();
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> {t('delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <RuleFormDialog open={editOpen} onOpenChange={setEditOpen} ruleToEdit={rule} />
        </>
    );
};
