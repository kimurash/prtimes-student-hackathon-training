import { useState } from "react";
import "./App.css";
import TodoInputComponent from "./components/todo/input/TodoInputComponent";
import TodoListComponent from "./components/todo/list/TodoListComponent";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const appendTodo = (todo: Todo) => {
    setTodos((prevTodos) => {
      return [...prevTodos, todo];
    });
  };

  return (
    <>
      <h1 className="text-3xl">TODOアプリ</h1>
      <TodoInputComponent appendTodo={appendTodo} />
      <TodoListComponent todos={todos} />
    </>
  );
}

export default App;
