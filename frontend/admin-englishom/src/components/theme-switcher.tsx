'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();
  return (
    <button
      lang="en"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="group scale-75 rounded-full bg-primary-foreground p-[5px] text-primary-foreground outline-1 outline-primary focus-visible:outline md:scale-100"
    >
      <span className="sr-only">
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </span>
      <span aria-hidden="true" className="relative flex gap-2.5">
        <span className="absolute size-[38px] rounded-full bg-primary/90 transition-all group-hover:bg-primary dark:translate-x-[48px]" />
        <span className="relative grid size-[38px] place-items-center rounded-full text-primary-foreground dark:text-foreground">
          <Sun size={20} />
        </span>
        <span className="relative grid size-[38px] place-items-center rounded-full text-primary dark:text-primary-foreground">
          <Moon size={20} />
        </span>
      </span>
    </button>
  );
};

export default ThemeSwitcher;
