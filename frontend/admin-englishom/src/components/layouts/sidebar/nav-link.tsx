import { Link } from '@/components/shared/smooth-navigation';
import { cn } from '@/lib/utils';
import { FC } from 'react';

type Props = React.ComponentProps<typeof Link> & {
  isActive?: boolean;
};
const NavLink: FC<Props> = ({ isActive = false, className, ...props }) => (
  <Link
    className={cn('block rounded-lg px-3.5 py-3 font-medium', className, {
      'bg-primary-foreground text-primary dark:bg-primary dark:text-primary-foreground':
        isActive,
      'opacity-70 hover:bg-muted/10 dark:hover:bg-muted-foreground/10':
        !isActive,
    })}
    {...props}
  />
);

export default NavLink;
