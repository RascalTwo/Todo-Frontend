import { serializeTodos } from './todo';
import { LocalTodo, Todo } from './types';

export const isServerOnline = (): Promise<boolean> => fetch('/api').then(r => r.ok);

export const readTodos = (code: string): Promise<LocalTodo[]> =>
  fetch(`/api/${code}`).then(r => r.json());

export const createTodo = (code: string, todo: Todo): Promise<LocalTodo> =>
  fetch(`/api/${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serializeTodos([todo])[0])
  }).then(r => r.json());

export const updateTodo = (code: string, todo: Todo): Promise<LocalTodo> =>
  fetch(`/api/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serializeTodos([todo])[0])
  }).then(r => r.json());

export const deleteTodo = (code: string, created: Date): Promise<void> =>
  fetch(`/api/${code}/${created.getTime()}`, {
    method: 'DELETE'
  }).then(() => undefined);
