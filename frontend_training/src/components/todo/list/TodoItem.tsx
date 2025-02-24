interface TodoItemProps {
  todo: Todo;
  fetchTodos: () => Promise<void>;
  updateTodo: (todoId: number, newTodo: Todo) => void;
}

const TodoItem = ({ todo, fetchTodos, updateTodo }: TodoItemProps) => {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const handleCheckBoxChange = async () => {
    const newTodo = {
      ...todo,
      status: todo.status === "completed" ? "pending" : "completed",
    } as Todo;

    // prettier-ignore
    const response = await fetch(
      `${ENDPOINT}/todos?id=${todo.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      }
    );
    if (!response.ok) {
      alert("タスクを更新できませんでした");
      return;
    }

    await fetchTodos();
  };

  const handleDeleteButtonClick = async () => {
    // prettier-ignore
    const response = await fetch(
      `${ENDPOINT}/todos?id=${todo.id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      alert("タスクを削除できませんでした");
      return;
    }

    await fetchTodos();
  };

  return (
    <div className="h-13 flex items-center">
      <input
        type="checkbox"
        checked={todo.status === "completed"}
        className="w-6 h-6 ms-2"
        onChange={handleCheckBoxChange}
      />
      <div
        className={`
          py-3 ms-2 text-lg flex-grow
          ${todo.status === "completed" ? "line-through text-gray-500" : ""}
        `}
        onClick={() => {
          const newTodo = { ...todo, isEditing: true };
          updateTodo(todo.id, newTodo);
        }}
      >
        {todo.title}
      </div>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-2 me-2"
        onClick={handleDeleteButtonClick}
      >
        削除
      </button>
    </div>
  );
};

export default TodoItem;
