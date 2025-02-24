interface Todo {
  id: number;
  title: string;
  status: "pending" | "active" | "completed";
  isEditing: boolean;
}
