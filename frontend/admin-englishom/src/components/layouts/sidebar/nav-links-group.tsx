import { FC, useId } from 'react';
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
  return (
    <Accordion type="single" collapsible>
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
