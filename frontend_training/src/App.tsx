import { useCallback, useEffect, useState } from "react";
import "./App.css";
import TodoInputComponent from "./components/todo/input/TodoInputComponent";
import TodoListComponent from "./components/todo/list/TodoListComponent";

function App() {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    // prettier-ignore
    const response = await fetch(
      `${ENDPOINT}/todos`,
      {
        method: "GET"
      }
    );
    const resBody: {
      status: string;
      data: Omit<Todo, "isEditing">[];
    } = await response.json();
    // prettier-ignore
    const todos = resBody.data.map(
      (todo) => {
        return { ...todo, isEditing: false };
      }
    );

    setTodos(todos);
  }, []);

  useEffect(() => {
    const initialFetchTodos = async () => {
      await fetchTodos();
    };
    initialFetchTodos();
  }, []);

  const updateTodo = (todoId: number, newTodo: Todo) => {
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

  return (
    <>
      <h1 className="text-3xl">TODOアプリ</h1>
      <TodoInputComponent fetchTodos={fetchTodos} />
      <TodoListComponent
        todos={todos}
        fetchTodos={fetchTodos}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default App;
