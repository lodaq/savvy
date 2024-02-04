import { type JSX, useEffect, useRef, useState } from 'react';

interface MasonaryLayoutProps {
  elements: JSX.Element[];
  minColWidth: number;
  verticalGap?: number;
  horizontalGap?: number;
  equalColWidth?: boolean;
  className?: string;
  isRefetched: boolean;
}

export default function MasonaryLayout({
  elements,
  minColWidth,
  verticalGap = 0,
  horizontalGap = 0,
  equalColWidth = false,
  className,
  isRefetched,
}: MasonaryLayoutProps) {
  const [numOfCols, setNumOfCols] = useState<number>(0);
  const [cols, setCols] = useState<JSX.Element[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const resizeHandler = () => {
    const w = Math.min(window.innerWidth - 2 * (8 + 16) - 5, containerRef?.current?.offsetWidth ?? 9999);
    const gapSpace = (Math.trunc(w / minColWidth) - 1) * horizontalGap;
    const maxWidth = w - gapSpace;
    const noc = Math.trunc(maxWidth / minColWidth);
    for (let i = noc; i > 0; i--) {
      if (maxWidth > i * minColWidth) {
        setNumOfCols(i);
        break;
      }
    }
  };

  useEffect(() => {
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefetched]);

  useEffect(() => {
    const newCols: JSX.Element[][] = [];
    for (let i = 0; i < elements.length; i++) {
      for (let j = 0; i < elements.length && j < numOfCols; j++) {
        if (!newCols[j]) newCols[j] = [];
        newCols[j].push(elements[i]);
        j !== numOfCols - 1 && i++;
      }
    }
    setCols(newCols);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numOfCols, isRefetched]);

  return (
    <div className={`flex ${className}`} style={{ gap: `${horizontalGap}px` }} ref={containerRef}>
      {cols.map((col, i) => (
        <div
          key={i}
          className="flex flex-col"
          style={{
            gap: `${verticalGap}px`,
            minWidth: `${minColWidth}px`,
            flexBasis: `${equalColWidth ? '100%' : null}`,
          }}
        >
          {col}
        </div>
      ))}
    </div>
  );
}
