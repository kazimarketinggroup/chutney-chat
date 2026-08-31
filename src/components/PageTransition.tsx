'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Trigger smooth top bar line animation on route change
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative w-full">
      {/* Top Accent Progress Bar during page route transition */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF6600] via-[#FFA059] to-[#FF6600] shadow-[0_0_10px_#FF6600]"
          initial={{ width: '0%', opacity: 1 }}
          animate={{
            width: isNavigating ? ['0%', '70%', '100%'] : '100%',
            opacity: isNavigating ? 1 : 0,
          }}
          transition={{
            duration: isNavigating ? 0.45 : 0.25,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Smooth Animated Page Wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for ultra-smooth spring ease
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
