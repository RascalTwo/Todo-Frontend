import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, List } from '@material-ui/core';

import NewTodo from './components/NewTodo';
import TodoItem from './components/TodoItem';
import ThemeToggler from './components/ThemeToggler';
import VisitListCode from './components/VisitListCode';

import { serializeTodos, parseTodos } from './todo';

import { Todo } from './types';
import * as API from './API';
import { useLocalState } from './hooks';
import SyncIndicator from './components/SyncIndicator';

const useTodos = (code: string, serverOnline: boolean) => {
  const [todos, setTodos] = useLocalState<Todo[]>(
    `todos-${code}`,
    [],
    todos => JSON.stringify(serializeTodos(todos)),
    rawTodos => parseTodos(JSON.parse(rawTodos))
  );

  const isLocal = useMemo(() => !code, [code]);

  useEffect(() => {
    if (!serverOnline || isLocal) return;
    API.readTodos(code).then(parseTodos).then(setTodos);
  }, [isLocal, code, serverOnline]);

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
          if (!serverOnline || isLocal) return [...todos, todo];

          API.createTodo(code, todo)
            .then(rawTodo => parseTodos([rawTodo])[0])
            .then(todo => setTodos([...todos, todo]));

          return todos;
        })
      ),
    [isLocal, code, setTodos, serverOnline, API.createTodo]
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
            if (serverOnline && !isLocal) API.updateTodo(code, updatedTodo);
            return updatedTodo;
          });
        });
      }),
    [isLocal, code, setTodos, serverOnline, API.updateTodo]
  );

  const deleteTodo = useCallback(
    (created: Date) =>
      setTodos(todos =>
        todos.filter(todo => {
          if (todo.created !== created) return true;
          if (serverOnline && !isLocal) API.deleteTodo(code, todo.created);
          return false;
        })
      ),
    [isLocal, code, setTodos, serverOnline, API.deleteTodo]
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
          if (serverOnline && !isLocal) API.updateTodo(code, updatedTodo);
          return updatedTodo;
        })
      ),
    [isLocal, code, setTodos, serverOnline, API.updateTodo]
  );

  return { todos, addTodo, updateTodo, deleteTodo, toggleCompleted };
};

const useServerOnline = () => {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    API.isServerOnline().then(setServerOnline);
  }, []);

  return serverOnline;
};

const useCode = (): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [code, setCodeValue] = useState(window.location.pathname.slice(1));

  const setCode: React.Dispatch<React.SetStateAction<string>> = action =>
    setCodeValue(code => {
      const newCode = action instanceof Function ? action(code) : action;
      history.pushState({}, '', '/' + newCode);
      return newCode;
    });

  return [code, setCode];
};

function App(): JSX.Element {
  const [code, setCode] = useCode();
  const serverOnline = useServerOnline();
  const { todos, addTodo, updateTodo, deleteTodo, toggleCompleted } = useTodos(
    code,
    !!serverOnline
  );

  return (
    <ThemeToggler>
      <SyncIndicator code={code} serverOnline={!!serverOnline} />
      <Container fixed maxWidth="sm">
        <VisitListCode code={code} setCode={setCode} />
        <NewTodo onSubmission={addTodo} />
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
    </ThemeToggler>
  );
}

export default App;
