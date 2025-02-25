const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export interface TodoRequest {
  title: string;
  status: "pending" | "active" | "completed";
}

export interface TodoResponse {
  status: string;
  data: {
    id: number;
    title: string;
    status: "pending" | "active" | "completed";
  }[];
}

export const fetchTodos = async () => {
  // prettier-ignore
  const response = await fetch(
    `${ENDPOINT}/todos`,
    {
      method: "GET"
    }
  );
  if (!response.ok) {
    return null;
  }

  const resBody: TodoResponse = await response.json();
  const todoDataList = resBody.data;
  // prettier-ignore
  const todos = todoDataList.map(
    (todoData) => {
      return {
        ...todoData,
        isEditing: false,
      }
    }
  );

  return todos;
};

export const fetchTodoById = async (todoId: number) => {
  // prettier-ignore
  const response = await fetch(
    `${ENDPOINT}/todos/${todoId}`,
    {
      method: "GET"
    }
  );
  if (!response.ok) {
    return null;
  }
  const resBody: TodoResponse = await response.json();

  const todos = resBody.data;
  if (todos.length === 0) {
    return null;
  } else {
    return {
      ...todos[0],
      isEditing: false,
    };
  }
};

export const createTodo = async (todo: TodoRequest) => {
  // prettier-ignore
  const response = await fetch(
    `${ENDPOINT}/todos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }
  );

  return response.ok;
};

export const updateTodo = async (todoId: number, todo: TodoRequest) => {
  // prettier-ignore
  const response = await fetch(
    `${ENDPOINT}/todos?id=${todoId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }
  );

  return response.ok;
};

export const deleteTodo = async (todoId: number) => {
  // prettier-ignore
  const response = await fetch(
    `${ENDPOINT}/todos?id=${todoId}`,
    {
      method: "DELETE",
    }
  );

  return response.ok;
};
