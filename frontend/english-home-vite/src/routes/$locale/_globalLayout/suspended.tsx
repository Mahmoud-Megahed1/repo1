import { createFileRoute } from '@tanstack/react-router'
import SuspendedAccountPage from '@/shared/components/suspended-account-page'

export const Route = createFileRoute('/$locale/_globalLayout/suspended')({
    component: () => <SuspendedAccountPage />,
})
