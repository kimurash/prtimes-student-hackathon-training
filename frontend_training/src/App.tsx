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

  const toggleCompleted = (todoId: string) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, isCompleted: !todo.isCompleted };
        } else{
          return todo;
        }
      });
    });
  };

  return (
    <>
      <h1 className="text-3xl">TODOアプリ</h1>
      <TodoInputComponent appendTodo={appendTodo} />
      <TodoListComponent todos={todos} toggleCompleted={toggleCompleted} />
    </>
  );
}

export default App;
