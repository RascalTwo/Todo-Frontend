import React, { useCallback, useMemo } from 'react';
import {
  createMuiTheme,
  IconButton,
  PaletteType,
  Theme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery
} from '@material-ui/core';

import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';

import { useLocalState } from '../hooks';

/** Allow Toggling of {@link PaletteType} */
const useThemeToggle = (initial: PaletteType): [Theme, () => void] => {
  const [type, setType] = useLocalState('theme', initial);
  return [
    useMemo(() => createMuiTheme({
      palette: { type }
    }), [type]),
    useCallback(() => setType(type => (type === 'dark' ? 'light' : 'dark')), [setType])
  ];
};

/**
 * Wrapper to apply {@link useThemeToggle toggleable theme} to children,
 * initally from [prefers-color-schema](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
 */
export default function ThemeToggler({ children }: { children: React.ReactNode }) {
  const [theme, toggleTheme] = useThemeToggle(
    useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  );

  return (
    <ThemeProvider theme={theme}>
      <IconButton
        title={`${theme.palette.type === 'light' ? 'Dark' : 'Light'} mode`}
        onClick={toggleTheme}
      >
        <BrightnessMediumIcon />
      </IconButton>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
