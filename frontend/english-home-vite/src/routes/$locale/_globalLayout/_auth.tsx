import { ChatWidget } from '@components/chat/chat-widget';
import { withProtectedRoute } from '@components/protected-route';
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
