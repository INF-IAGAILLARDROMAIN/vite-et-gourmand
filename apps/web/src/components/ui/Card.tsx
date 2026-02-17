'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.12)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
