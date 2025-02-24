import { useTodoStore } from "@/stores/todos";
import TodoEditItem from "./TodoEditItem";
import TodoItem from "./TodoItem";

export const TodoListComponent = () => {
  const { todos } = useTodoStore();

  return (
    <ul className="w-xl text-gray-900 bg-white border border-gray-200 rounded-lg mt-3">
      {todos.map((todo) => (
        <li key={todo.id} className="border-b border-gray-400 rounded-t-lg">
          {todo.isEditing ? (
            <TodoEditItem todo={todo} />
          ) : (
            <TodoItem todo={todo} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoListComponent;
