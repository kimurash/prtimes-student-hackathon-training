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

  const updateTodo = (todoId: string, newTodo: Todo) => {
    setTodos((prevTodos) => {
      return prevTodos.map((prevTodo) => {
        if (prevTodo.id === todoId) {
          return newTodo;
        } else {
          return prevTodo;
        }
      });
    });
  };

  const removeTodo = (todoId: string) => {
    setTodos((prevTodos) => {
      return prevTodos.filter((prevTodo) => prevTodo.id !== todoId);
    });
  };

  return (
    <>
      <h1 className="text-3xl">TODOアプリ</h1>
      <TodoInputComponent appendTodo={appendTodo} />
      <TodoListComponent todos={todos} updateTodo={updateTodo} removeTodo={removeTodo} />
    </>
  );
}

export default App;
