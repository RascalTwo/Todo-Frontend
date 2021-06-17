import { useEffect, useRef, useState } from 'react';
import { parseTodos } from './todo';
import { LocalTodo, Todo, TodoChanges } from './types';

const API_HOST = import.meta.env['VITE_SERVER_HOST'] || window.location.host;

export const isServerOnline = (): Promise<boolean> =>
  fetch(`http://${API_HOST}/api`).then(r => r.ok);

export const readTodos = (code: string): Promise<LocalTodo[]> =>
  fetch(`http://${API_HOST}/api/${code}`).then(r => r.json());

export const createTodo = (code: string, text: string): Promise<LocalTodo> =>
  fetch(`http://${API_HOST}/api/${code}`, {
    method: 'POST',
    body: text
  }).then(r => r.json());

export const updateTodo = (code: string, changes: TodoChanges): Promise<LocalTodo> =>
  fetch(`http://${API_HOST}/api/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  }).then(r => r.json());

export const deleteTodo = (code: string, created: Date): Promise<void> =>
  fetch(`http://${API_HOST}/api/${code}/${created.getTime()}`, {
    method: 'DELETE'
  }).then(() => undefined);

export const useWSAPI = (
  code: string,
  connect: boolean,
  onCreate: (todo: Todo) => void,
  onUpdate: (updatedTodo: Todo) => void,
  onDelete: (created: Date) => void,
  setRealtime: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [memberCount, setMemberCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!connect) return;
    const ws = new WebSocket(`ws://${API_HOST}/ws/${code}`, [Date.now().toString()]);
    ws.addEventListener('open', () => {
      wsRef.current = ws;
      setRealtime(true);
    });
    ws.addEventListener('close', e => {
      if (wsRef.current?.protocol === (e.target as WebSocket).protocol) {
        wsRef.current = null;
        setRealtime(false);
      }
    });

    ws.addEventListener('message', e => {
      const [action, payload]: [
        'create' | 'update' | 'delete' | 'memberCount' | 'error',
        LocalTodo | number
      ] = JSON.parse(e.data);
      switch (action) {
        case 'create':
          onCreate(parseTodos([payload as LocalTodo])[0]);
          break;
        case 'update':
          onUpdate(parseTodos([payload as LocalTodo])[0]);
          break;
        case 'delete':
          onDelete(new Date(payload as number));
          break;
        case 'memberCount':
          setMemberCount(payload as number);
          break;
        case 'error':
          console.error('WS Error:', payload);
          break;
      }
    });

    return () => {
      wsRef.current = null;
      ws.close();
    };
  }, [code, connect]);

  const sendAction = (action: string, payload: any) =>
    wsRef.current?.send(JSON.stringify([action, payload]));

  const createTodo = (text: string) => sendAction('create', text);
  const updateTodo = (changes: TodoChanges) => sendAction('update', changes);
  const deleteTodo = (created: Date) => sendAction('delete', created.getTime());

  return { ws: wsRef.current, createTodo, updateTodo, deleteTodo, memberCount };
};
