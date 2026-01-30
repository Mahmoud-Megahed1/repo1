'use client';
import { useRouter } from '@/components/shared/smooth-navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { login } from '@/services/admins';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GalleryVerticalEnd } from 'lucide-react';

function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-secondary p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          English Home
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['adminLogin'],
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.data.access_token);
      queryClient.invalidateQueries({ queryKey: ['getLoggedAdmin'] });
      router.push('/admin');
    },
  });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    mutate({ data: { email, password } });
  };
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login to Admin Panel</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button disabled={isPending} className="w-full">
                  {isPending ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
