import { useEffect, useRef } from 'react';
import axiosClient from '@lib/axios-client';
import { useNavigate } from '@shared/i18n/routing';

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

/**
 * Hook that periodically checks session validity.
 * If the session is invalid (401), clears the token and redirects to login.
 * This ensures single-device login enforcement.
 */
export function useSessionHeartbeat(isAuthenticated: boolean) {
    const navigate = useNavigate();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            // Clear any existing interval if not authenticated
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const checkSession = async () => {
            try {
                // Make a lightweight request to check session validity
                await axiosClient.get('/users/me');
            } catch (error: any) {
                if (error?.response?.status === 401) {
                    // Session is invalid - user logged in from another device
                    localStorage.removeItem('token');

                    // Show a message before redirecting
                    alert('تم تسجيل الدخول من جهاز آخر. سيتم تسجيل خروجك الآن.');

                    navigate({ to: '/login' });
                }
            }
        };

        // Start the heartbeat interval
        intervalRef.current = window.setInterval(checkSession, HEARTBEAT_INTERVAL);

        // Also check immediately on mount
        checkSession();

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAuthenticated, navigate]);
}

export default useSessionHeartbeat;
