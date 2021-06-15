import { useState } from 'react';

export const useLocalState = <T>(
  key: string,
  initial: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (rawValue: string) => T = JSON.parse
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setStateValue] = useState(() => {
    const localInitial = localStorage.getItem(key);
    return localInitial === null ? initial : deserialize(localInitial);
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = action =>
    setStateValue(value => {
      const newValue = action instanceof Function ? action(value) : action;
      localStorage.setItem(key, serialize(newValue));
      return newValue;
    });

  return [value, setValue];
};
