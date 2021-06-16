export type Todo = {
  created: Date;
  updated: Date;
  text: string;
  completed: Date | null;
};

export type LocalTodo = {
  created: number;
  updated: number;
  text: string;
  completed: number | null;
};

export type TodoChanges = {
  created: number;
  text?: string;
  completed?: number | null;
};
