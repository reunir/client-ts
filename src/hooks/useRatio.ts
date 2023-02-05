import { useState, useCallback } from 'react';

export function useCardRatio(initialRatio: number) {
  const [aspectRatio, setAspectRatio] = useState(initialRatio);

  const calculateRatio = useCallback((height: number, width: number) => {
    if (height && width) {
      const isLandscape = height <= width;
      const ratio = isLandscape ? width / height : height / width;

      setAspectRatio(ratio);
    }
  }, []);

  return { aspectRatio, calculateRatio };
}
