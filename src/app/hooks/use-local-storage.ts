export const useLocalStorage = () => {
  const setLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key: string): string | null => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return item;
  };
  const clearLocalStorage = (key: string): void => {
    const item = localStorage.removeItem(key);
  };

  return { getLocalStorage, setLocalStorage, clearLocalStorage };
};
