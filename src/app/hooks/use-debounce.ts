import { useEffect, useState } from "react";

interface Props {
  value: string;
  delay: number;
}

export const useDebounce = ({ value, delay }: Props) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);

  return debouncedValue;
};
