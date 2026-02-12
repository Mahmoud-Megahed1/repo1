import { withProtectedRoute } from '@components/protected-route';
import { ChatWidget } from '@shared/components/chat/chat-widget';
import { useTheme } from '@components/contexts/theme-context';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/_auth')({
  component: withProtectedRoute(RouteComponent),
});

function RouteComponent() {
  const { dynamicTheme } = useTheme();

  // Hide chat widget if admin disabled it (default: show)
  const showChat = dynamicTheme?.showSupportChat !== false;

  return (
    <>
      <Outlet />
      {showChat && <ChatWidget />}
    </>
  );
}
