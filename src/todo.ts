import { LocalTodo, Todo } from './types';

export const serializeTodos = (todos: Todo[]): LocalTodo[] =>
	todos.map(({ created, updated, text, completed }) => ({
		created: created.getTime(),
		updated: updated.getTime(),
		completed: completed ? completed.getTime() : null,
		text
	}));

export const parseTodos = (rawTodos: LocalTodo[]): Todo[] =>
	rawTodos.map(({ created, updated, text, completed }: LocalTodo) => ({
		created: new Date(created),
		updated: new Date(updated),
		completed: completed === null ? completed : new Date(completed),
		text
	}));
