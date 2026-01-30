import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '@ui/sonner';
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="bg-background text-foreground min-h-svh">
      <HeadContent />
      <Outlet />
      <Toaster richColors />
    </div>
  );
}
