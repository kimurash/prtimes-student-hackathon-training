import TodoEditItem from "./TodoEditItem";
import TodoItem from "./TodoItem";

interface TodoListComponentProps {
  todos: Todo[];
  updateTodo: (todoId: string, newTodo: Todo) => void;
  removeTodo: (todoId: string) => void;
}

export const TodoListComponent = (
  { todos, updateTodo, removeTodo }: TodoListComponentProps
) => {
  return (
    <ul className="w-xl text-gray-900 bg-white border border-gray-200 rounded-lg mt-3">
      {
        todos.map((todo) => (
          <li
            key={todo.id}
            className='border-b border-gray-400 rounded-t-lg'
          >
            {
              todo.isEditing
                ? (
                  <TodoEditItem todo={todo} updateTodo={updateTodo} />
                ) : (
                  <TodoItem todo={todo} updateTodo={updateTodo} removeTodo={removeTodo} />
                )
            }
          </li>
        ))
      }
    </ul>
  )
}

export default TodoListComponent;
