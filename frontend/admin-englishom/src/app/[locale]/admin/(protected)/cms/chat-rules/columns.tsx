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

export const columns: ColumnDef<ChatRule>[] = [
    {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => <span className="font-bold">{row.original.priority}</span>,
    },
    {
        accessorKey: 'keywords',
        header: 'Keywords',
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
        header: 'Match Type',
        cell: ({ row }) => (
            <Badge variant={row.original.matchType === 'exact' ? 'destructive' : 'default'}>
                {row.original.matchType}
            </Badge>
        ),
    },
    {
        accessorKey: 'response',
        header: 'Response',
        cell: ({ row }) => <div className="max-w-[400px] truncate" title={row.original.response}>{row.original.response}</div>,
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? 'outline' : 'secondary'}>
                {row.original.isActive ? 'Active' : 'Inactive'}
            </Badge>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionCell rule={row.original} />,
    },
];

const ActionCell = ({ rule }: { rule: ChatRule }) => {
    const [editOpen, setEditOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: deleteMutate } = useMutation({
        mutationFn: () => deleteChatRule(rule._id),
        onSuccess: () => {
            toast.success('Rule deleted');
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
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this rule?')) deleteMutate();
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <RuleFormDialog open={editOpen} onOpenChange={setEditOpen} ruleToEdit={rule} />
        </>
    );
};
