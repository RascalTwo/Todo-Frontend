import React, { useCallback, useEffect, useState } from 'react'
import {  Container, List } from '@material-ui/core'


import NewTodo from './components/NewTodo';
import TodoItem from './components/TodoItem';

import { LocalTodo, Todo } from './types';

import './App.css'


const useLocallySavedTodos = (): [Todo[], (newTodos: Todo[]) => void] => {
  const [todos, setTodoValues] = useState<Todo[]>([]);

  const syncTodos = useCallback((todos: Todo[]) => {
    if (todos.length) localStorage.setItem('todos', JSON.stringify(todos));
    else localStorage.removeItem('todos');
  }, []);

  const setTodos = useCallback((newTodos: Todo[]) => {
    setTodoValues(newTodos);
    syncTodos(newTodos);
  }, []);

  useEffect(() => {
    const rawTodos = localStorage.getItem('todos');
    if (rawTodos !== null) setTodoValues(JSON.parse(rawTodos).map(({ created, updated, text, completed }: LocalTodo) => ({
      created: new Date(created),
      updated: new Date(updated),
      completed: completed === null ? completed : new Date(completed),
      text
    })));

    return () => syncTodos(todos);
  }, []);

  return [todos, setTodos];
}


function App() {
  const [todos, setTodos] = useLocallySavedTodos();

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
