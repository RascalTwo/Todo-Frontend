import React, { DependencyList, useCallback, useEffect, useMemo, useState } from 'react';
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

const replaceAtIndex = <T extends any>(array: T[], index: number, replacement: T): T[] => [
  ...array.slice(0, index),
  replacement,
  ...array.slice(index + 1)
];

const removeAtIndex = <T extends any>(array: T[], index: number): T[] => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
];

const useTodos = (
  code: string,
  serverOnline: boolean,
  setRealtime: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [todos, setTodos] = useLocalState<Todo[]>(
    `todos-${code}`,
    [],
    todos => JSON.stringify(serializeTodos(todos)),
    rawTodos => parseTodos(JSON.parse(rawTodos))
  );

  const isLocal = useMemo(() => !code, [code]);

  const WSAPI = API.useWSAPI(
    code,
    serverOnline && !isLocal,
    todo => setTodos(todos => [...todos, todo]),
    updatedTodo =>
      setTodos(todos =>
        replaceAtIndex(
          todos,
          todos.findIndex(todo => todo.created.valueOf() === updatedTodo.created.valueOf()),
          updatedTodo
        )
      ),
    created =>
      setTodos(todos =>
        removeAtIndex(
          todos,
          todos.findIndex(todo => todo.created.valueOf() === created.valueOf())
        )
      ),
    setRealtime
  );

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

          if (WSAPI.ws) WSAPI.createTodo(newText);
          else
            API.createTodo(code, newText)
              .then(rawTodo => parseTodos([rawTodo])[0])
              .then(todo => setTodos([...todos, todo]));

          return todos;
        })
      ),
    [WSAPI.ws, isLocal, code, setTodos, serverOnline, API.createTodo]
  );

  const updateTodo = useCallback(
    (created: Date, newText: string) =>
      new Promise<void>((resolve, reject) => {
        return setTodos(todos => {
          const existingTodo = todos.find(
            todo => created.valueOf() !== todo.created.valueOf() && todo.text === newText
          );
          if (existingTodo) {
            reject(Error('TODO already exists'));
            return todos;
          }
          resolve();
          const updated = new Date();

          const updatingIndex = todos.findIndex(
            todo => todo.created.valueOf() === created.valueOf()
          );
          const updatedTodo = {
            ...todos[updatingIndex],
            updated,
            text: newText
          };
          if (!serverOnline || isLocal) return replaceAtIndex(todos, updatingIndex, updatedTodo);

          if (WSAPI.ws) WSAPI.updateTodo({ created: created.getTime(), text: newText });
          else
            API.updateTodo(code, { created: created.getTime(), text: newText })
              .then(rawTodo => parseTodos([rawTodo])[0])
              .then(todo => setTodos(replaceAtIndex(todos, updatingIndex, todo)));

          return todos;
        });
      }),
    [WSAPI.ws, isLocal, code, setTodos, serverOnline, API.updateTodo]
  );

  const deleteTodo = useCallback(
    (created: Date) =>
      setTodos(todos => {
        const removingIndex = todos.findIndex(todo => todo.created.valueOf() === created.valueOf());
        if (!serverOnline || isLocal) return removeAtIndex(todos, removingIndex);

        if (WSAPI.ws) WSAPI.deleteTodo(created);
        else
          API.deleteTodo(code, created).then(() => setTodos(removeAtIndex(todos, removingIndex)));

        return todos;
      }),
    [WSAPI.ws, isLocal, code, setTodos, serverOnline, API.deleteTodo]
  );

  const toggleCompleted = useCallback(
    (created: Date) =>
      setTodos(todos => {
        const updatingIndex = todos.findIndex(todo => todo.created.valueOf() === created.valueOf());
        const completed = todos[updatingIndex].completed ? null : new Date();
        if (!serverOnline || isLocal)
          return replaceAtIndex(todos, updatingIndex, { ...todos[updatingIndex], completed });

        if (WSAPI.ws)
          WSAPI.updateTodo({ created: created.getTime(), completed: completed?.getTime() || null });
        else
          API.updateTodo(code, {
            created: created.getTime(),
            completed: completed?.getTime() || null
          })
            .then(rawTodo => parseTodos([rawTodo])[0])
            .then(todo => setTodos(replaceAtIndex(todos, updatingIndex, todo)));

        return todos;
      }),
    [WSAPI.ws, isLocal, code, setTodos, serverOnline, API.updateTodo]
  );

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleCompleted,
    realtimeMemberCount: WSAPI.memberCount
  };
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

const useTitle = (setter: (...deps: DependencyList) => string, deps: DependencyList) => {
  useEffect(() => {
    document.title = setter(...deps);
  }, deps);
};

function App(): JSX.Element {
  const [code, setCode] = useCode();
  useTitle((code: string) => 'Todos - ' + (code ? `#${code}` : 'Local'), [code]);
  const serverOnline = useServerOnline();
  const [realtime, setRealtime] = useState(false);
  const { todos, addTodo, updateTodo, deleteTodo, toggleCompleted, realtimeMemberCount } = useTodos(
    code,
    !!serverOnline,
    setRealtime
  );

  return (
    <ThemeToggler>
      <SyncIndicator
        code={code}
        serverOnline={!!serverOnline}
        realtime={realtime}
        realtimeMemberCount={realtimeMemberCount}
      />
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
