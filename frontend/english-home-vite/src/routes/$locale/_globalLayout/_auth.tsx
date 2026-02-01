import { withProtectedRoute } from '@components/protected-route';
import { ChatWidget } from '@shared/components/chat/chat-widget';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/_auth')({
  component: withProtectedRoute(RouteComponent),
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <ChatWidget />
    </>
  );
}
