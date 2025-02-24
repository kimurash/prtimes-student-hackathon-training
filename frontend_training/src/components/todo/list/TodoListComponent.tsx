import TodoEditItem from "./TodoEditItem";
import TodoItem from "./TodoItem";

interface TodoListComponentProps {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  updateTodo: (todoId: number, newTodo: Todo) => void;
}

export const TodoListComponent = ({
  todos,
  fetchTodos,
  updateTodo,
}: TodoListComponentProps) => {
  return (
    <ul className="w-xl text-gray-900 bg-white border border-gray-200 rounded-lg mt-3">
      {todos.map((todo) => (
        <li key={todo.id} className="border-b border-gray-400 rounded-t-lg">
          {todo.isEditing ? (
            <TodoEditItem
              todo={todo}
              fetchTodos={fetchTodos}
              updateTodo={updateTodo}
            />
          ) : (
            <TodoItem
              todo={todo}
              fetchTodos={fetchTodos}
              updateTodo={updateTodo}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoListComponent;
