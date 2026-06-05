import { usePathname } from '@/i18n/routing';
import { FC, useId, useEffect, useState } from 'react';
import NavLink from './nav-link';
import { NavItem } from '.';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

type Props = {
  item: NavItem & {
    children: NavItem[];
  };
};
const NavLinksGroup: FC<Props> = ({
  item: { href, children, label, icon: Icon, isActive },
}) => {
  const id = useId();
  const isAnyChildActive = children.some((child) => child.isActive);
  const pathname = usePathname();
  
  // Use stable key for storage
  const storageKey = `accordion-${href.split('?')[0]}`;
  
  const [value, setValue] = useState<string | undefined>(
    isActive || isAnyChildActive ? id : undefined
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    const lastPath = sessionStorage.getItem(`${storageKey}-path`);
    
    if (saved !== null && lastPath === pathname) {
      // If we stayed on the same logical path (e.g. language switch), restore manual state
      setValue(saved === 'open' ? id : undefined);
    } else {
      // Otherwise, default to open if active
      setValue(isActive || isAnyChildActive ? id : undefined);
      // Clean up storage if we navigated away
      if (saved !== null && lastPath !== pathname) {
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(`${storageKey}-path`);
      }
    }
  }, [isActive, isAnyChildActive, id, storageKey, pathname]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    sessionStorage.setItem(storageKey, newValue ? 'open' : 'closed');
    sessionStorage.setItem(`${storageKey}-path`, pathname);
  };

  return (
    <Accordion type="single" collapsible value={value} onValueChange={handleValueChange}>
      <AccordionItem value={id} className="border-none">
        <AccordionTrigger className="px-3.5 py-3 hover:no-underline" asChild>
          <NavLink
            className="flex w-full items-center gap-3"
            href={href}
            isActive={isActive}
          >
            <span className="flex items-center gap-3">
              {Icon && <Icon />}
              {label}
            </span>
            <ChevronDown className="size-4 shrink-0" />
          </NavLink>
        </AccordionTrigger>
        <AccordionContent className="text-base">
          <ul className="space-y- mt-2 flex-1 ps-6 text-[0.8em]">
            {children.map(({ href, icon: Icon, label, isActive }, i) => (
              <li key={i}>
                <NavLink
                  className="flex items-center gap-3 py-2.5"
                  href={href}
                  isActive={isActive}
                >
                  {Icon && <Icon />}
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default NavLinksGroup;
