import { useState } from "react";

interface TodoInputComponentProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoInputComponent = (
  { setTodos }: TodoInputComponentProps
) => {
  const [todoTitle, setTodoTitle] = useState<string>("")

  const handleAddButtonClick = () => {
    if(0 <= todoTitle.length){
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            title: todoTitle,
            status: "pending"
          }
        ]
      })

      console.log("Todo added")
    }
  };

  return (
    <div className="flex justify-center my-4">
      <input
        className="border w-md p-2 mr-2"
        type="text"
        value={todoTitle}
        onChange={(event) => {
          console.log(event.target.value)
          setTodoTitle(event.target.value)
        }}
        placeholder="タスクを入力してください"
      />
      <button
        className="rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 transition"
        onClick={handleAddButtonClick}
      >
        追加
      </button>
    </div>
  );
};

export default TodoInputComponent;
