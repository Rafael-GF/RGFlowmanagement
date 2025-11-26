import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-md 
        transition-all duration-200
        ${hover ? 'hover:shadow-xl cursor-pointer' : ''}
        ${onClick ? 'text-left w-full' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}
