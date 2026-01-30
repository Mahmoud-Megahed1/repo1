import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useLocale } from 'next-intl';
import * as React from 'react';
import { Input } from './input';

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const locale = useLocale();
  return (
    <div className="relative">
      <Input
        ref={ref}
        className={cn('pe-10', className)}
        {...props}
        type={showPassword ? 'text' : 'password'}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground',
          {
            'left-3': locale === 'ar',
            'right-3': locale !== 'ar',
          },
        )}
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
