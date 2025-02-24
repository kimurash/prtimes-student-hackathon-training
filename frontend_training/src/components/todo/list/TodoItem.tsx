import { deleteTodo, fetchTodo, fetchTodos, updateTodo } from "@/api/todo";
import { useTodoStore } from "@/stores/todos";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { setTodoState, updateTodoState } = useTodoStore();

  const handleCheckBoxChange = async () => {
    const newTodo = {
      ...todo,
      status: todo.status === "completed" ? "pending" : "completed",
    };

    const success = await updateTodo(todo.id, newTodo as Todo);
    if (!success) {
      alert("タスクを更新できませんでした");
      return;
    }

    const updatedTodo = await fetchTodo(todo.id);
    if (updatedTodo === null) {
      alert("タスクを取得できませんでした");
      return;
    }

    updateTodoState(todo.id, updatedTodo);
  };

  const handleTitleClick = () => {
    const newTodo = { ...todo, isEditing: true };
    updateTodoState(todo.id, newTodo);
  };

  const handleDeleteButtonClick = async () => {
    const success = await deleteTodo(todo.id);
    if (!success) {
      alert("タスクを削除できませんでした");
      return;
    }

    const todos = await fetchTodos();
    if (todos === null) {
      alert("タスクを取得できませんでした");
      return;
    }

    setTodoState(todos);
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
        onClick={handleTitleClick}
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
