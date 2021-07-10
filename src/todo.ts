import { RawTodo, Todo } from './types';

export const serializeTodos = (todos: Todo[]): RawTodo[] =>
	todos.map(({ created, updated, text, completed }) => ({
		created: created.getTime(),
		updated: updated ? updated.getTime() : null,
		completed: completed ? completed.getTime() : null,
		text
	}));

export const parseTodos = (rawTodos: RawTodo[]): Todo[] =>
	rawTodos.map(({ created, updated, text, completed }: RawTodo) => ({
		created: new Date(created),
		updated: updated === null ? updated : new Date(updated),
		completed: completed === null ? completed : new Date(completed),
		text
	}));
