import React, { useCallback, useState } from 'react';
import {
  makeStyles,
  IconButton,
  TextField,
  TextFieldProps,
  Paper,
  InputAdornment,
  IconButtonProps
} from '@material-ui/core';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    padding: '0.5em'
  },
  input: {
    flex: '1'
  },
  helperText: {
    position: 'absolute',
    right: '4em',
    top: 0,
    pointerEvents: 'none'
  }
});

export type TextFieldIconFormProps = {
  onSubmission: (text: string) => void;
  children: React.ReactNode;
  IconButtonProps?: IconButtonProps;
  resetOnSuccess?: boolean;
} & TextFieldProps;

export default function TextFieldIconForm({
  onSubmission,
  children,
  IconButtonProps,
  resetOnSuccess = true,
  ...props
}: TextFieldIconFormProps) {
  const styles = useStyles();
  const [error, setError] = useState<string | undefined>();
  return (
    <Paper
      component="form"
      className={styles.form}
      onSubmit={useCallback(
        async (e: React.FormEvent<HTMLDivElement>) => {
          e.preventDefault();

          const input = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
          try {
            await onSubmission(input.value);
            if (resetOnSuccess) (e.target as HTMLFormElement).reset();
            setError(undefined);
          } catch (e) {
            setError(e.message);
          }
        },
        [resetOnSuccess, onSubmission, setError]
      )}
    >
      <TextField
        error={!!error}
        helperText={error ? <span className={styles.helperText}>{error}</span> : null}
        className={styles.input}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" {...IconButtonProps}>
                {children}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...props}
      />
    </Paper>
  );
}
