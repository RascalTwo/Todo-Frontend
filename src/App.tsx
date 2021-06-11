import React, { useEffect, useRef, useState } from 'react'

import { Box, Button, Card, Checkbox, Container, Divider, FormGroup, FormHelperText, IconButton, InputBase, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, makeStyles, Paper, TextField } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AddIcon from '@material-ui/icons/Add';

import './App.css'

type Todo = {
  created: Date
  updated: Date
  text: string
  completed: Date | null
}

const useWhenTextStyles = makeStyles({
  wrapper: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  }
});


function WhenText({ created, updated }: { created: Date, updated: Date }){
  const styles = useWhenTextStyles();

  const isUpdated = created.getTime() !== updated.getTime();

  const title = isUpdated
    ? `Created  ${created.toLocaleString()}\nUpdated ${updated.toLocaleString()}`
    : created.toLocaleString();

  return (
    <span className={styles.wrapper} title={title}>
      <AccessTimeIcon />
    </span>
  )
}

const useTodoItemStyles = makeStyles({
  completedText: {
    '&[data-completed="true"]': {
      textDecoration: 'line-through'
    }
  }
})

function TodoItem({ todo, deleteTodo, updateTodo, toggleCompleted }: { todo: Todo, deleteTodo: () => void, updateTodo: (text: string) => void, toggleCompleted: () => void }){
  const styles = useTodoItemStyles();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string|undefined>();

  const textField = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    if (editing && textField.current) textField.current.querySelector('input')!.focus();
    if (!editing && error) setError(undefined);
  }, [editing]);

  const itemIcon = (
    <ListItemIcon>
      <Checkbox disabled checked={!!todo.completed} onChange={toggleCompleted} size="small" />
    </ListItemIcon>
  );

  const whenText = <WhenText created={todo.created} updated={todo.updated} />

  return editing
    ? (
      <ListItem divider={true}>
        <form onSubmit={(e) => {
          e.preventDefault();
          try{
            updateTodo(((e.target as HTMLFormElement).elements[1] as HTMLInputElement).value);
            setEditing(false);
            setError(undefined);
          } catch(e){
            setError(e.message);
          }
        }}>
          {itemIcon}
          <TextField ref={textField} error={!!error} helperText={error} placeholder="Item" defaultValue={todo.text} />
          <ListItemSecondaryAction>
            <IconButton type="submit" title="Edit">
              <SaveIcon />
            </IconButton>
            <IconButton title="Cancel" onClick={() => setEditing(false)}>
              <CancelIcon />
            </IconButton>
            {whenText}
          </ListItemSecondaryAction>
        </form>
      </ListItem>
    )
    : (
      <ListItem divider={true} button onClick={toggleCompleted}>
        {itemIcon}
        <ListItemText classes={{ root: styles.completedText }} data-completed={!!todo.completed}>{todo.text}</ListItemText>
        <ListItemSecondaryAction>
          <IconButton title="Edit" onClick={() => setEditing(true)} disabled={!!todo.completed}>
            <EditIcon />
          </IconButton>
          <IconButton title="Delete" onClick={deleteTodo}>
            <DeleteIcon />
          </IconButton>
          {whenText}
        </ListItemSecondaryAction>
      </ListItem>
    );
}

const useNewTodoStyles = makeStyles({
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
})

function NewTodo({ addTodo }: { addTodo: (text: string) => void }){
  const styles = useNewTodoStyles();
  const [error, setError] = useState<string|undefined>();

  return (
    <Paper component="form" className={styles.form} onSubmit={e => {
      e.preventDefault();

      const input = ((e.target as HTMLFormElement).elements[0] as HTMLInputElement);
      try{
        addTodo(input.value);
        input.value = '';
        setError(undefined)
      } catch(e){
        setError(e.message);
      }
    }}>
      <InputBase error={!!error} className={styles.input} placeholder="New Item" />
      <FormHelperText error={!!error} className={styles.errorText}>{error}</FormHelperText>
      <IconButton type="submit" title="Add Item">
        <AddIcon/>
      </IconButton>
    </Paper>
  )
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([{ completed: null, created: new Date(), text: 'Hello, world!', updated: new Date() }]);



  return (
    <Container fixed maxWidth="sm">
      <NewTodo
        addTodo={newText => {
          const existingTodo = todos.find(({ text }) => text === newText)
          if (existingTodo) throw new Error('TODO already exists');
          setTodos([...todos, { created: new Date(), updated: new Date(), text: newText, completed: null }]);
        }}
      />
      <List>
        {todos.map((item, i) =>
          <TodoItem
            key={i}
            todo={item}
            updateTodo={newText => {
              const existingTodo = todos.find(({ text }, ti) => i !== ti && text === newText)
              if (existingTodo) throw new Error('TODO already exists');
              return setTodos(todos.map(todo => todo.created === item.created ? {
                ...todo,
                updated: new Date(),
                text: newText
              } : todo))
            }}
            deleteTodo={() =>
              setTodos(todos.filter(todo => todo.created !== item.created))
            }
            toggleCompleted={() =>
                setTodos(todos.map(todo =>
                  todo.created === item.created
                    ? { ...todo, completed: item.completed ? null : new Date() }
                    : todo
                  )
                )
            }
          />
        )}
      </List>
    </Container>
  )
}

export default App
