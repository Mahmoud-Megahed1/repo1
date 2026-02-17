import { useNavigate } from '@shared/i18n/routing';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

// @ts-ignore - Route types not generated yet
export const Route = createFileRoute('/payment/tamara/success')({
    component: PaymentSuccess,
});

function PaymentSuccess() {
    const navigate = useNavigate();
    // unused orderId removed

    useEffect(() => {
        // Retrieve the levelId we saved before redirecting to Tamara
        const pendingLevelId = sessionStorage.getItem('tamaraPendingLevelId');
        const redirectPath = pendingLevelId
            ? `/app/levels/${pendingLevelId}`
            : '/app'; // Fallback

        // clean up
        sessionStorage.removeItem('tamaraPendingLevelId');

        // Redirect to the course page
        const timer = setTimeout(() => {
            navigate({ to: redirectPath as any });
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <div className="text-2xl font-bold text-green-600">Payment Successful!</div>
            <p>Redirecting you to your course...</p>
        </div>
    );
}
