import { useNavigate } from '@shared/i18n/routing';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@ui/button';
import { XCircle } from 'lucide-react';

// @ts-ignore - Route types not generated yet
export const Route = createFileRoute('/payment/tamara/failure')({
    component: PaymentFailure,
});

function PaymentFailure() {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('tamaraPendingLevelId');
    }, []);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <div className="text-2xl font-bold text-red-600">Payment Failed or Cancelled</div>
            <p>We couldn't process your payment via Tamara.</p>
            <Button onClick={() => navigate({ to: '/app' })}>
                Return to App
            </Button>
        </div>
    );
}
