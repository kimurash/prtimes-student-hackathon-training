import { fetchTodo, updateTodo } from "@/api/todo";
import { useTodoStore } from "@/stores/todos";
import { useState } from "react";

const TodoEditItem = ({ todo }: { todo: Todo }) => {
  const { updateTodoState } = useTodoStore();
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);

  const handleCancelButtonClick = () => {
    const newTodo = { ...todo, isEditing: false };
    updateTodoState(todo.id, newTodo);
  };

  const handleUpdateButtonClick = async () => {
    const newTodo = { ...todo, title: todoTitle };

    const success = await updateTodo(todo.id, newTodo);
    if (!success) {
      alert("タスクを更新できませんでした");
      return;
    }

    const updatedTodo = await fetchTodo(todo.id);
    if (updatedTodo === null) {
      alert("タスクを取得できませんでした");
      return;
    }

    updateTodoState(todo.id, updatedTodo);
  };

  return (
    <div className="h-13 flex items-center">
      <input
        id={todo.id.toString()}
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
        onClick={handleCancelButtonClick}
      >
        キャンセル
      </button>
      <button
        type="button"
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2 me-2"
        onClick={handleUpdateButtonClick}
      >
        更新
      </button>
    </div>
  );
};

export default TodoEditItem;
