import { createFileRoute } from '@tanstack/react-router';
import AdminAISettings from '@modules/admin/ai-settings';

export const Route = createFileRoute(
    '/$locale/_globalLayout/_auth/app/admin/ai-settings',
)({
    component: AdminAISettings,
});
