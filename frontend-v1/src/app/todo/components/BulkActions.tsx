import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Todo } from "../types/todo";

export const BulkActions = ({
  setSelectedTodos,
  todos,
  selectedTodos,
  setTodos,
  updateTodo,
}: {
  todos: Todo[];
  selectedTodos: Set<string>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setSelectedTodos: Dispatch<SetStateAction<Set<string>>>;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}) => {
  const bulkDelete = () => {
    setTodos((prev) => prev.filter((todo) => !selectedTodos.has(todo.id)));
    setSelectedTodos(new Set());
  };

  const bulkComplete = () => {
    todos.forEach((todo) => {
      if (selectedTodos.has(todo.id)) {
        updateTodo(todo.id, { completed: true });
      }
    });
    setSelectedTodos(new Set());
  };

  return (
    <Card className="cyber-card border-glow-pink mb-8 animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-neon-pink font-cyber text-lg">
            {selectedTodos.size} TASK(S) SELECTED FOR BATCH PROCESSING
          </span>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={bulkComplete}
              className="bg-neon-green/20 border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-cyber-dark font-cyber transition-all duration-300"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              COMPLETE ALL
            </Button>
            <Button
              size="lg"
              onClick={bulkDelete}
              className="bg-neon-red/20 border-2 border-neon-red text-neon-red hover:bg-neon-red hover:text-cyber-dark font-cyber transition-all duration-300"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              PURGE ALL
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
