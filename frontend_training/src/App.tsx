import { useState } from "react";
import "./App.css";
import TodoInputComponent from "./components/todo/input/TodoInputComponent";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <>
      <h1 className="text-3xl">TODOアプリ</h1>
      <TodoInputComponent setTodos={setTodos} />
    </>
  );
}

export default App;
