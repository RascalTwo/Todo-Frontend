import React, { useCallback, useEffect, useState } from 'react';
import { Container, List } from '@material-ui/core';

import NewTodo from './components/NewTodo';
import TodoItem from './components/TodoItem';

import { LocalTodo, Todo } from './types';

import './App.css';

const useLocallySavedTodos = (): [Todo[], React.Dispatch<React.SetStateAction<Todo[]>>] => {
  const [todos, setTodoValues] = useState<Todo[]>([]);

  const syncTodos = useCallback((todos: Todo[]) => {
    if (todos.length) localStorage.setItem('todos', JSON.stringify(todos));
    else localStorage.removeItem('todos');
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
    const rawTodos = localStorage.getItem('todos');
    if (rawTodos !== null)
      setTodoValues(
        JSON.parse(rawTodos).map(({ created, updated, text, completed }: LocalTodo) => ({
          created: new Date(created),
          updated: new Date(updated),
          completed: completed === null ? completed : new Date(completed),
          text
        }))
      );

    return () => syncTodos(todos);
  }, []);

  return [todos, setTodos];
};

function App(): JSX.Element {
  const [todos, setTodos] = useLocallySavedTodos();

  const addTodo = useCallback(
    newText =>
      new Promise<void>((resolve, reject) =>
        setTodos(todos => {
          const existingTodo = todos.find(({ text }) => text === newText);
          if (existingTodo) {
            reject(new Error('TODO already exists'));
            return todos;
          }
          resolve();
          return [
            ...todos,
            { created: new Date(), updated: new Date(), text: newText, completed: null }
          ];
        })
      ),
    [setTodos]
  );

  const updateTodo = useCallback(
    (created, newText) =>
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
          return todos.map(todo =>
            todo.created === created
              ? {
                  ...todo,
                  updated: new Date(),
                  text: newText
                }
              : todo
          );
        });
      }),
    [setTodos]
  );

  const deleteTodo = useCallback(
    created => setTodos(todos => todos.filter(todo => todo.created !== created)),
    [setTodos]
  );

  const toggleCompleted = useCallback(
    created =>
      setTodos(todos =>
        todos.map(todo =>
          todo.created === created
            ? {
                ...todo,
                completed: todos.find(todo => todo.created === created)?.completed
                  ? null
                  : new Date()
              }
            : todo
        )
      ),
    [setTodos]
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
