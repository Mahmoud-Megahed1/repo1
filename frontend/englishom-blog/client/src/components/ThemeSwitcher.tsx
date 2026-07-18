import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function ThemeSwitcher() {
  const { theme, toggleTheme, switchable } = useTheme();
  
  if (!switchable || !toggleTheme) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex h-10 w-[76px] shrink-0 items-center rounded-full p-1 transition-colors duration-300 cursor-pointer",
        isDark ? "bg-[#2d2d2d]" : "bg-[#F1E4D6]"
      )}
      aria-label="Toggle theme"
    >
      <div
        className={cn(
          "absolute left-1 h-8 w-8 rounded-full transition-transform duration-300 ease-in-out rtl:right-1 rtl:left-auto",
          isDark 
            ? "rtl:-translate-x-9 ltr:translate-x-9 translate-x-9 bg-[#F1E4D6]" 
            : "translate-x-0 bg-[#43303F]"
        )}
      />
      <div className="relative z-10 flex h-full w-1/2 items-center justify-center">
        <Sun className={cn("h-4 w-4 transition-colors", isDark ? "text-zinc-400" : "text-[#F1E4D6]")} />
      </div>
      <div className="relative z-10 flex h-full w-1/2 items-center justify-center">
        <Moon className={cn("h-4 w-4 transition-colors", isDark ? "text-[#2d2d2d]" : "text-[#43303F]")} />
      </div>
    </button>
  );
}
