import React, { useCallback, useState } from 'react';
import { FormHelperText, IconButton, InputBase, makeStyles, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    padding: '0.5em'
  },
  input: {
    flex: '1'
  },
  errorText: {
    display: 'flex',
    alignItems: 'center'
  }
});

export default function NewTodo({
  addTodo
}: {
  addTodo: (text: string) => Promise<void>;
}): JSX.Element {
  const styles = useStyles();
  const [error, setError] = useState<string | undefined>();

  return (
    <Paper
      component="form"
      className={styles.form}
      onSubmit={useCallback(async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();

        const input = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
        try {
          await addTodo(input.value);
          input.value = '';
          setError(undefined);
        } catch (e) {
          setError(e.message);
        }
      }, [addTodo, setError])}
    >
      <InputBase error={!!error} className={styles.input} placeholder="New Item" />
      <FormHelperText error={!!error} className={styles.errorText}>
        {error}
      </FormHelperText>
      <IconButton type="submit" title="Add Item">
        <AddIcon />
      </IconButton>
    </Paper>
  );
}
