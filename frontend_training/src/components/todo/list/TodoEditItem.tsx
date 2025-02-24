import { useState } from "react";

interface TodoEditItemProps {
  todo: Todo;
  fetchTodos: () => Promise<void>;
  updateTodo: (todoId: number, newTodo: Todo) => void;
}

const TodoEditItem = ({ todo, fetchTodos, updateTodo }: TodoEditItemProps) => {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);

  const handleUpdateButtonClick = async () => {
    const newTodo = { ...todo, title: todoTitle };

    // prettier-ignore
    const response = await fetch(
      `${ENDPOINT}/todos?id=${todo.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      }
    );
    if (!response.ok) {
      alert("タスクを更新できませんでした");
      return;
    }

    await fetchTodos();
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
        onClick={handleUpdateButtonClick}
      >
        更新
      </button>
    </div>
  );
};

export default TodoEditItem;
