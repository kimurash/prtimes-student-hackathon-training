
interface TodoListComponentProps {
  todos: Todo[]
}

export const TodoListComponent = (
  { todos }: TodoListComponentProps
) => {
  return (
    <ul className="w-lg text-gray-900 bg-white border border-gray-200 rounded-lg">
      {todos.map((todo) => (
        <li key={todo.id} className="border-b border-gray-400 rounded-t-lg">
          <div className="flex items-center">
            <input
              id={todo.id}
              type="checkbox"
              className="w-6 h-6 ms-2"
            />
            <label
              htmlFor={todo.id}
              className="py-3 ms-2"
            >
              {todo.title}
            </label>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TodoListComponent;
