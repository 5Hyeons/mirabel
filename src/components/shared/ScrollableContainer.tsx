import { ReactNode } from 'react';

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string;
}

export function ScrollableContainer({ children, className = '' }: ScrollableContainerProps) {
  return (
    <div className={`flex-1 overflow-y-auto scrollbar-hide ${className}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {children}
    </div>
  );
}
