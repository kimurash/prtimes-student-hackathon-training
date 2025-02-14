import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface TodoInputComponentProps {
  appendTodo: (todo: Todo) => void;
}

export const TodoInputComponent = (
  { appendTodo }: TodoInputComponentProps
) => {
  const [todoTitle, setTodoTitle] = useState<string>("")

  return (
    <div className="flex justify-center my-4">
      <input
        className="border w-md p-2 mr-2"
        type="text"
        value={todoTitle}
        onChange={(event) => {
          setTodoTitle(event.target.value)
        }}
        placeholder="タスクを入力してください"
      />
      <button
        className="rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 transition"
        onClick={() => {
          const todo = {
            id: uuidv4(),
            title: todoTitle,
            isCompleted: false,
          };
          appendTodo(todo);
          setTodoTitle("");
        }}
      >
        追加
      </button>
    </div>
  );
};

export default TodoInputComponent;
