
import { useState } from 'react';

interface TodoEditItemProps {
  todo: Todo;
  updateTodo: (todoId: string, newTodo: Todo) => void;
}

const TodoEditItem = ({ todo, updateTodo }: TodoEditItemProps) => {
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);

  return (
    <div className="h-13 flex items-center">
      <input
        id={todo.id}
        type="text"
        value={todoTitle}
        className="w-6 h-8 border p-2 mx-4 text-lg flex-grow"
        onChange={(event) => {
          setTodoTitle(event.target.value);
        }}
      />
      <button
        type="button"
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg px-5 py-2 me-2"
        onClick={() => {
          const newTodo = { ...todo, isEditing: false };
          updateTodo(todo.id, newTodo);
        }}
      >
          キャンセル
      </button>
      <button
        type="button"
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2 me-2"
        onClick={() => {
          const newTodo = { ...todo, title: todoTitle, isEditing: false };
          updateTodo(todo.id, newTodo);
        }}
      >
        更新
      </button>
    </div>
  )
}

export default TodoEditItem
