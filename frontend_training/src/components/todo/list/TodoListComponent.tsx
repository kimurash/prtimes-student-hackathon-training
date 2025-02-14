
interface TodoListComponentProps {
  todos: Todo[]
  toggleCompleted: (todoId: string) => void
}

export const TodoListComponent = (
  { todos, toggleCompleted }: TodoListComponentProps
) => {
  return (
    <ul className="w-lg text-gray-900 bg-white border border-gray-200 rounded-lg">
      {todos
        .filter((todo) => !todo.isCompleted)
        .map((todo) => (
          <li key={todo.id} className="border-b border-gray-400 rounded-t-lg">
            <div className="flex items-center">
              <input
                id={todo.id}
                type="checkbox"
                checked={todo.isCompleted}
                className="w-6 h-6 ms-2"
                onChange={() => {
                  toggleCompleted(todo.id);
                }}
              />
              <label
                htmlFor={todo.id}
                className="py-3 ms-2"
              >
                {todo.title}
              </label>
            </div>
          </li>
        ))
      }
    </ul>
  )
}

export default TodoListComponent;
