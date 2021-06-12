import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, List } from '@material-ui/core';

import NewTodo from './components/NewTodo';
import TodoItem from './components/TodoItem';

import { serializeTodos, parseTodos } from './todo';

import { Todo } from './types';
import * as API from './API';

const useLocallySavedTodos = (
  code: string
): [Todo[], React.Dispatch<React.SetStateAction<Todo[]>>] => {
  const [todos, setTodoValues] = useState<Todo[]>([]);

  const syncTodos = useCallback((todos: Todo[]) => {
    if (todos.length) localStorage.setItem(`todos-${code}`, JSON.stringify(serializeTodos(todos)));
    else localStorage.removeItem(`todos-${code}`);
  }, []);

  const setTodos = useCallback(
    (newTodos: React.SetStateAction<Todo[]>) =>
      setTodoValues(prevTodos => {
        const actualTodos = newTodos instanceof Function ? newTodos(prevTodos) : newTodos;
        syncTodos(actualTodos);
        return actualTodos;
      }),
    []
  );

  useEffect(() => {
    const rawTodos = localStorage.getItem(`todos-${code}`);
    if (rawTodos !== null) setTodoValues(parseTodos(JSON.parse(rawTodos)));

    return () => syncTodos(todos);
  }, []);

  return [todos, setTodos];
};

function App(): JSX.Element {
  const code = useRef(window.location.pathname.slice(1)).current;

  const [todos, setTodos] = useLocallySavedTodos(code);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    API.isServerOnline().then(online => setServerOnline(Boolean(code && online)));
  }, []);

  useEffect(() => {
    if (!serverOnline) return;
    API.readTodos(code).then(parseTodos).then(setTodos);
  }, [serverOnline]);

  const addTodo = useCallback(
    (newText: string) =>
      new Promise<void>((resolve, reject) =>
        setTodos(todos => {
          const existingTodo = todos.find(({ text }) => text === newText);
          if (existingTodo) {
            reject(new Error('TODO already exists'));
            return todos;
          }
          resolve();
          const todo = { created: new Date(), updated: new Date(), text: newText, completed: null };
          if (!serverOnline) return [...todos, todo];

          API.createTodo(code, todo)
            .then(rawTodo => parseTodos([rawTodo])[0])
            .then(todo => setTodos([...todos, todo]));

          return todos;
        })
      ),
    [setTodos, serverOnline, API.createTodo]
  );

  const updateTodo = useCallback(
    (created: Date, newText: string) =>
      new Promise<void>((resolve, reject) => {
        return setTodos(todos => {
          const existingTodo = todos.find(
            todo => created !== todo.created && todo.text === newText
          );
          if (existingTodo) {
            reject(Error('TODO already exists'));
            return todos;
          }
          resolve();
          const updated = new Date();
          return todos.map(todo => {
            if (todo.created !== created) return todo;

            const updatedTodo = {
              ...todo,
              updated,
              text: newText
            };
            if (serverOnline) API.updateTodo(code, updatedTodo);
            return updatedTodo;
          });
        });
      }),
    [setTodos, serverOnline, API.updateTodo]
  );

  const deleteTodo = useCallback(
    (created: Date) =>
      setTodos(todos =>
        todos.filter(todo => {
          if (todo.created !== created) return true;
          if (serverOnline) API.deleteTodo(code, todo.created);
          return false;
        })
      ),
    [setTodos, serverOnline, API.deleteTodo]
  );

  const toggleCompleted = useCallback(
    created =>
      setTodos(todos =>
        todos.map(todo => {
          if (todo.created !== created) return todo;
          const updatedTodo = {
            ...todo,
            completed: todos.find(todo => todo.created === created)?.completed ? null : new Date()
          };
          if (serverOnline) API.updateTodo(code, updatedTodo);
          return updatedTodo;
        })
      ),
    [setTodos, serverOnline, API.updateTodo]
  );

  return (
    <Container fixed maxWidth="sm">
      <NewTodo addTodo={addTodo} />
      <List>
        {todos.map((item, i) => (
          <TodoItem
            key={i}
            todo={item}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
            onToggle={toggleCompleted}
          />
        ))}
      </List>
    </Container>
  );
}

export default App;
