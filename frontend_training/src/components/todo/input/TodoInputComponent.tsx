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
    <div className="flex justify-center mt-6 mb-3">
      <input
        className="border w-lg p-2 mr-2"
        type="text"
        value={todoTitle}
        onChange={(event) => {
          setTodoTitle(event.target.value)
        }}
        placeholder="タスクを入力してください"
      />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 focus:outline-none"
        onClick={() => {
          if(todoTitle === ""){
            alert("タスクを入力してください");
            return;
          }
          
          const todo = {
            id: uuidv4(),
            title: todoTitle,
            isCompleted: false,
            isEditing: false,
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
