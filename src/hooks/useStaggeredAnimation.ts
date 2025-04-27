
import { useEffect, useState } from 'react';

type StaggerProps = {
  itemCount: number;
  staggerDelay?: number;
  initialDelay?: number;
  onComplete?: () => void;
};

export const useStaggeredAnimation = ({
  itemCount,
  staggerDelay = 100,
  initialDelay = 0,
  onComplete,
}: StaggerProps) => {
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);

  useEffect(() => {
    const indices: number[] = [];
    
    const timeout = setTimeout(() => {
      for (let i = 0; i < itemCount; i++) {
        const delay = i * staggerDelay;
        setTimeout(() => {
          setVisibleIndices(prev => {
            const newIndices = [...prev, i];
            if (newIndices.length === itemCount && onComplete) {
              onComplete();
            }
            return newIndices;
          });
        }, delay);
      }
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [itemCount, staggerDelay, initialDelay, onComplete]);

  const isVisible = (index: number) => visibleIndices.includes(index);

  return { isVisible };
};
