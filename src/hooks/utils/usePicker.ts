import { useCallback, useState } from "react";

export function usePicker<T>() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [onResolve, setOnResolve] = useState<
    ((value: T | null) => void) | null
  >(null);
  const openPicker = useCallback(() => {
    return new Promise<T | null>(resolve => {
      setOnResolve(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const closePicker = useCallback(
    (value: T | null) => {
      setIsOpen(false);
      if (onResolve) onResolve(value);
    },
    [onResolve]
  );

  return { isOpen, openPicker, closePicker };
}
