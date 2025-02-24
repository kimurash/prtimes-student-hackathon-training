import { useEffect } from "react";
import { fetchTodos } from "./api/todo";
import "./App.css";
import TodoInputComponent from "./components/todo/input/TodoInputComponent";
import TodoListComponent from "./components/todo/list/TodoListComponent";
import { useTodoStore } from "./stores/todos";

function App() {
  const { setTodoState } = useTodoStore();

  useEffect(() => {
    const initialFetchTodos = async () => {
      const todos = await fetchTodos();
      if (todos === null) {
        alert("タスクを取得できませんでした");
        return;
      }
      setTodoState(todos);
    };

    initialFetchTodos();
  }, []);

  return (
    <>
      <h1 className="text-3xl">TODOアプリ</h1>
      <TodoInputComponent />
      <TodoListComponent />
    </>
  );
}

export default App;
