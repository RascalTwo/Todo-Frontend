import React, { useCallback } from 'react';
import {
  createMuiTheme,
  IconButton,
  PaletteType,
  Theme,
  ThemeProvider,
  CssBaseline
} from '@material-ui/core';

import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';

import { useLocalState } from '../hooks';

const useThemeToggle = (initial: PaletteType): [Theme, () => void] => {
  const [type, setType] = useLocalState('theme', initial);
  return [
    createMuiTheme({
      palette: { type }
    }),
    useCallback(() => setType(type => (type === 'dark' ? 'light' : 'dark')), [setType])
  ];
};

export default function ThemeToggler({ children }: { children: React.ReactNode }): JSX.Element {
  const [theme, toggleTheme] = useThemeToggle(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
