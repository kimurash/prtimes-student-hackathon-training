import { create } from "zustand";

interface TodoState {
  todos: Todo[];
  setTodoState: (todos: Todo[]) => void;
  updateTodoState: (todoId: number, newTodo: Todo) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodoState: (todos) => {
    set({ todos });
  },
  updateTodoState: (todoId, newTodo) => {
    set((state) => {
      return {
        // prettier-ignore
        todos: state.todos.map(
          (todo) => {
            if (todo.id === todoId) {
              return newTodo;
            } else {
              return todo;
            }
          }
        ),
      };
    });
  },
}));
