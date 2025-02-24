import { useState } from "react";

interface TodoInputComponentProps {
  fetchTodos: () => Promise<void>;
}

export const TodoInputComponent = ({ fetchTodos }: TodoInputComponentProps) => {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const [todoTitle, setTodoTitle] = useState<string>("");

  const handleAddButtonClick = async () => {
    if (todoTitle === "") {
      alert("タスクを入力してください");
      return;
    }

    const todo = {
      title: todoTitle,
      status: "pending",
    };

    // prettier-ignore
    const response = await fetch(
      `${ENDPOINT}/todos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      }
    );
    if (!response.ok) {
      alert("タスクを追加できませんでした");
      return;
    }

    setTodoTitle("");
    await fetchTodos();
  };

  return (
    <div className="flex justify-center mt-6 mb-3">
      <input
        className="border w-lg p-2 mr-2"
        type="text"
        value={todoTitle}
        onChange={(event) => {
          setTodoTitle(event.target.value);
        }}
        placeholder="タスクを入力してください"
      />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 focus:outline-none"
        onClick={handleAddButtonClick}
      >
        追加
      </button>
    </div>
  );
};

export default TodoInputComponent;
