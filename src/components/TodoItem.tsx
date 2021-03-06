import React, { useCallback, useEffect, useMemo, useState, Suspense } from 'react';

import {
  makeStyles,
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
const TextField = React.lazy(() => import('@material-ui/core/TextField'));

import { Edit, Delete, Save, Cancel } from '@material-ui/icons';

import WhenIcon from './WhenIcon';

import { Todo } from '../types';

const useTodoItemStyles = makeStyles({
  completedText: {
    '&[data-completed="true"]': {
      textDecoration: 'line-through'
    }
  },
  innerText: {
    width: '77.5%'
  }
});

/** {@link ListItem} of {@link Todo} */
export default React.memo(
  function TodoItem({
    todo,
    onDelete,
    onUpdate,
    onToggle
  }: {
    todo: Todo;
    onDelete: (created: Date) => void;
    onUpdate: (created: Date, text: string) => Promise<void>;
    onToggle: (created: Date) => void;
  }) {
    const styles = useTodoItemStyles();
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
      if (!editing && error) setError(undefined);
    }, [editing]);

    const handleToggle = useCallback(() => onToggle(todo.created), [onToggle, todo.created]);

    const itemIcon = useMemo(
      () => (
        <ListItemIcon>
          <Checkbox disabled checked={!!todo.completed} onChange={handleToggle} size="small" />
        </ListItemIcon>
      ),
      [handleToggle, todo.completed]
    );

    const whenText = useMemo(
      () => <WhenIcon created={todo.created} updated={todo.updated} completed={todo.completed} />,
      [todo.created, todo.updated, todo.completed]
    );

    const enableEditing = useCallback(() => setEditing(true), [setEditing]);
    const disableEditing = useCallback(() => setEditing(false), [setEditing]);

    const handleUpdate = useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          await onUpdate(
            todo.created,
            ((e.target as HTMLFormElement).elements[1] as HTMLInputElement).value
          );
          setEditing(false);
          setError(undefined);
        } catch (e) {
          setError(e.message);
        }
      },
      [onUpdate, setError, setEditing]
    );

    const handleDelete = useCallback(() => onDelete(todo.created), [onDelete, todo.created]);

    return editing ? (
      <ListItem divider={true}>
        <form onSubmit={handleUpdate}>
          {itemIcon}
          <Suspense fallback="">
            <TextField
              autoFocus
              error={!!error}
              helperText={error}
              placeholder="Item"
              defaultValue={todo.text}
            />
          </Suspense>
          <ListItemSecondaryAction>
            <IconButton type="submit" title="Edit">
              <Save />
            </IconButton>
            <IconButton title="Cancel" onClick={disableEditing}>
              <Cancel />
            </IconButton>
            {whenText}
          </ListItemSecondaryAction>
        </form>
      </ListItem>
    ) : (
      <ListItem divider={true} button onClick={handleToggle}>
        {itemIcon}
        <ListItemText
          classes={{ root: styles.completedText, primary: styles.innerText }}
          data-completed={!!todo.completed}
        >
          {todo.text}
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton title="Edit" onClick={enableEditing} disabled={!!todo.completed}>
            <Edit />
          </IconButton>
          <IconButton title="Delete" onClick={handleDelete}>
            <Delete />
          </IconButton>
          {whenText}
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
  (prev, curr) => prev.todo === curr.todo
);
