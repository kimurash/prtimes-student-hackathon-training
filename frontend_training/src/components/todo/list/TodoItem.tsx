interface TodoItemProps {
  todo: Todo;
  updateTodo: (todoId: string, newTodo: Todo) => void;
  removeTodo: (todoId: string) => void;
}

const TodoItem = ({todo, updateTodo, removeTodo}: TodoItemProps) => {
  return (
    <div className="h-13 flex items-center">
      <input
        type="checkbox"
        checked={todo.isCompleted}
        className="w-6 h-6 ms-2"
        onChange={() => {
          const newTodo = { ...todo, isCompleted: !todo.isCompleted };
          updateTodo(todo.id, newTodo);
        }}
      />
      <div
        className={`py-3 ms-2 text-lg flex-grow ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}
        onClick={() => {
          const newTodo = { ...todo, isEditing: true };
          updateTodo(todo.id, newTodo);
        }}
      >
        {todo.title}
      </div>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-2 me-2"
        onClick={() => {
          removeTodo(todo.id)
        }}
      >
        削除
      </button>
    </div>
  )
}

export default TodoItem
