'use client';

import React from 'react';

interface MasonryGridProps {
  children: React.ReactNode;
}

export default function MasonryGrid({ children }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance] space-y-4">
      {React.Children.map(children, (child, idx) => (
        <div key={idx} className="break-inside-avoid">
          {child}
        </div>
      ))}
    </div>
  );
}
