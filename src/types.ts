export type Todo = {
  created: Date;
  updated: Date | null;
  text: string;
  completed: Date | null;
};

export type RawTodo = {
  created: number;
  updated: number | null;
  text: string;
  completed: number | null;
};

export type TodoChanges = {
  created: number;
  text?: string;
  completed?: number | null;
};
