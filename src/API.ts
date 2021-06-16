import { LocalTodo, TodoChanges } from './types';

export const isServerOnline = (): Promise<boolean> => fetch('/api').then(r => r.ok);

export const readTodos = (code: string): Promise<LocalTodo[]> =>
  fetch(`/api/${code}`).then(r => r.json());

export const createTodo = (code: string, text: string): Promise<LocalTodo> =>
  fetch(`/api/${code}`, {
    method: 'POST',
    body: text
  }).then(r => r.json());

export const updateTodo = (
  code: string,
  changes: TodoChanges
): Promise<LocalTodo> =>
  fetch(`/api/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  }).then(r => r.json());

export const deleteTodo = (code: string, created: Date): Promise<void> =>
  fetch(`/api/${code}/${created.getTime()}`, {
    method: 'DELETE'
  }).then(() => undefined);
