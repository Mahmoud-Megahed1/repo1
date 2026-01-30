'use client';

import { Link } from '@/components/shared/smooth-navigation';

const AccountLocked = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-center text-foreground heading">
          Account Locked
        </h1>
        <p className="mb-6 text-center text-muted-foreground">
          Your account has been temporarily locked for security reasons. This
          may happen due to multiple failed login attempts or suspicious
          activity.
        </p>

        <div className="space-y-4">
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Please contact our support team or wait for 30 minutes before
              trying again.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <a
              href="mailto:support@example.com"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Contact Support
            </a>
            <Link
              href="/auth/login"
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLocked;
