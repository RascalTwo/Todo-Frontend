import { useEffect, useState } from 'react';

export const useLocalState = <T>(
  key: string,
  initial: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (rawValue: string) => T = JSON.parse
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setStateValue] = useState(initial);

  const setValue: React.Dispatch<React.SetStateAction<T>> = action =>
    setStateValue(value => {
      const newValue = action instanceof Function ? action(value) : action;
      window.localStorage.setItem(key, serialize(newValue));
      return newValue;
    });

  useEffect(
    () =>
      setStateValue(() => {
        const localInitial = window.localStorage.getItem(key);
        return localInitial === null ? initial : deserialize(localInitial);
      }),
    [key]
  );

  return [value, setValue];
};
