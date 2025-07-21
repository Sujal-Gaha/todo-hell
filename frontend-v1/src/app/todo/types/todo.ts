export type Priority = "low" | "medium" | "high" | "urgent";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  created_at: Date;
  updated_at: Date;
  category?: string;
  dueDate?: Date;
}
