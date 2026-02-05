import { ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@ui/button';
import { cn } from '@lib/utils';

/**
 * ScrollArrows - displays scroll navigation arrows
 * - Down arrow: appears when near top of page
 * - Up arrow: appears when scrolled down
 */
export default function ScrollArrows() {
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;

            // Show up arrow if scrolled more than 300px from top
            setShowUp(scrollTop > 300);

            // Show down arrow if not near bottom (more than 300px from bottom)
            setShowDown(scrollTop < scrollHeight - clientHeight - 300);
        };

        handleScroll(); // Initial check
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    return (
        <>
            {/* Up Arrow - fixed at bottom right */}
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    'fixed bottom-6 end-6 z-50 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300',
                    showUp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-5 w-5" />
            </Button>

            {/* Down Arrow - fixed at bottom right, above up arrow */}
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    'fixed bottom-20 end-6 z-50 rounded-full shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300',
                    showDown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
            >
                <ArrowDown className="h-5 w-5" />
            </Button>
        </>
    );
}
