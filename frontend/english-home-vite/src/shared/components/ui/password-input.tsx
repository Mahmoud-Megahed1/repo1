import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { Input } from './input';
import { cn } from '@lib/utils';

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
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
          'text-muted-foreground hover:text-foreground absolute top-1/2 -translate-y-1/2 cursor-pointer ltr:right-3 rtl:left-3'
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
