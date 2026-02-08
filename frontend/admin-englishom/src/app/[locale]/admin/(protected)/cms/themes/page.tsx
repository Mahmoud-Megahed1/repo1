'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getThemes, deleteTheme } from '@/services/themes';
import { Theme } from '@/types/themes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash, Edit } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function ThemesPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const { data: themes, isLoading } = useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const res = await getThemes();
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTheme,
    onSuccess: () => {
      toast.success(t('Global.deletedSuccessfully'));
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
    onError: () => {
      toast.error(t('Global.somethingWentWrong'));
    },
  });

  if (isLoading) return <div>{t('Global.loading')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={t('Admin.themes.title')} />
        <Link href="/admin/cms/themes/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('Admin.themes.add')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('Admin.themes.list')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Global.name')}</TableHead>
                <TableHead>{t('Global.startDate')}</TableHead>
                <TableHead>{t('Global.endDate')}</TableHead>
                <TableHead>{t('Global.status')}</TableHead>
                <TableHead>{t('Global.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(themes) && themes.map((theme: Theme) => (
                <TableRow key={theme._id}>
                  <TableCell>{theme.name}</TableCell>
                  <TableCell>{formatDate(theme.startDate)}</TableCell>
                  <TableCell>{formatDate(theme.endDate)}</TableCell>
                  <TableCell>
                    {theme.isActive ? (
                      <span className="text-green-600">{t('Global.active')}</span>
                    ) : (
                      <span className="text-red-600">{t('Global.inactive')}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/admin/cms/themes/edit/${theme._id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          if (confirm(t('Global.confirmDelete'))) {
                            deleteMutation.mutate(theme._id);
                          }
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {themes?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t('Global.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
