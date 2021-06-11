import React, { useEffect, useRef, useState } from 'react';

import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField
} from '@material-ui/core';

import { Edit, Delete, Save, Cancel } from '@material-ui/icons';

import WhenIcon from './WhenIcon';

import { Todo } from '../types';

const useTodoItemStyles = makeStyles({
  completedText: {
    '&[data-completed="true"]': {
      textDecoration: 'line-through'
    }
  }
});

export default function TodoItem({
  todo,
  deleteTodo,
  updateTodo,
  toggleCompleted
}: {
  todo: Todo;
  deleteTodo: () => void;
  updateTodo: (text: string) => void;
  toggleCompleted: () => void;
}): JSX.Element {
  const styles = useTodoItemStyles();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const textField = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editing && textField.current) textField.current.querySelector('input')?.focus();
    if (!editing && error) setError(undefined);
  }, [editing]);

  const itemIcon = (
    <ListItemIcon>
      <Checkbox disabled checked={!!todo.completed} onChange={toggleCompleted} size="small" />
    </ListItemIcon>
  );

  const whenText = <WhenIcon created={todo.created} updated={todo.updated} />;

  return editing ? (
    <ListItem divider={true}>
      <form
        onSubmit={e => {
          e.preventDefault();
          try {
            updateTodo(((e.target as HTMLFormElement).elements[1] as HTMLInputElement).value);
            setEditing(false);
            setError(undefined);
          } catch (e) {
            setError(e.message);
          }
        }}
      >
        {itemIcon}
        <TextField
          ref={textField}
          error={!!error}
          helperText={error}
          placeholder="Item"
          defaultValue={todo.text}
        />
        <ListItemSecondaryAction>
          <IconButton type="submit" title="Edit">
            <Save />
          </IconButton>
          <IconButton title="Cancel" onClick={() => setEditing(false)}>
            <Cancel />
          </IconButton>
          {whenText}
        </ListItemSecondaryAction>
      </form>
    </ListItem>
  ) : (
    <ListItem divider={true} button onClick={toggleCompleted}>
      {itemIcon}
      <ListItemText classes={{ root: styles.completedText }} data-completed={!!todo.completed}>
        {todo.text}
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton title="Edit" onClick={() => setEditing(true)} disabled={!!todo.completed}>
          <Edit />
        </IconButton>
        <IconButton title="Delete" onClick={deleteTodo}>
          <Delete />
        </IconButton>
        {whenText}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
