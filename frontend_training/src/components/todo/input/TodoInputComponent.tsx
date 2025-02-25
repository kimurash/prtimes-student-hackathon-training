import { createTodo, fetchTodos, TodoRequest } from "@/api/todo";
import { useTodoStore } from "@/stores/todos";
import { useState } from "react";

export const TodoInputComponent = () => {
  const { setTodoState } = useTodoStore();
  const [todoTitle, setTodoTitle] = useState<string>("");

  const handleAddButtonClick = async () => {
    if (todoTitle === "") {
      alert("タスクを入力してください");
      return;
    }

    const todo: TodoRequest = {
      title: todoTitle,
      status: "pending",
    };

    const success = await createTodo(todo);
    if (!success) {
      alert("タスクを追加できませんでした");
      return;
    }

    setTodoTitle("");

    const todos = await fetchTodos();
    if (todos === null) {
      alert("タスクを取得できませんでした");
      return;
    }

    setTodoState(todos);
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
