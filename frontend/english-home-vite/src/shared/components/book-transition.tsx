import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from '@tanstack/react-router';
import { type ReactNode, forwardRef } from 'react';

type BookTransitionProps = {
  children: ReactNode;
};

// Use forwardRef to ensure compatible typings if passed to other motion components or refs
export const BookTransition = forwardRef<HTMLDivElement, BookTransitionProps>(
  ({ children }, _ref) => {
    const location = useLocation();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth "page turn" feel
          }}
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%'
          }}
          className="perspective-1000" // Tailwind utility for perspective
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }
);

BookTransition.displayName = 'BookTransition';
