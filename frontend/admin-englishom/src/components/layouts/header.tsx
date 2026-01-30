'use client';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import React from 'react';
import LanguageSwitcher from '../language-switcher';
import ThemeSwitcher from '../theme-switcher';
type Props = {
  title?: React.ReactNode;
};
const Header: React.FC<Props> = ({ title = 'Dashboard' }) => {
  return (
    <header className="container-sm sticky top-0 z-10 flex h-20 items-center justify-between bg-primary text-primary-foreground backdrop-blur-lg dark:bg-primary-foreground/50 dark:text-primary">
      <div className="flex items-center gap-2">
        <button onClick={() => window.setIsOpen((prev) => !prev)}>
          <MenuIcon className="size-6" />
        </button>
        <div className="text-xl font-bold">{title}</div>
      </div>
      <div className="flex items-center md:gap-4">
        <Button
          variant="default"
          className="dark size-auto py-1 font-bold"
          asChild
        >
          <LanguageSwitcher className="scale-75 md:scale-100" />
        </Button>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
