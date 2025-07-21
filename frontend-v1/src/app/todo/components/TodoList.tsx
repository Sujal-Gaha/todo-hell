import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Edit,
  Eye,
  MoreVertical,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Todo } from "../types/todo";
import { Dispatch, SetStateAction } from "react";

const priorityConfig = {
  low: {
    color: "text-neon-blue",
    bg: "bg-neon-blue/10",
    border: "border-neon-blue/50",
    glow: "glow-cyan",
    icon: Circle,
  },
  medium: {
    color: "text-neon-yellow",
    bg: "bg-neon-yellow/10",
    border: "border-neon-yellow/50",
    glow: "glow-purple",
    icon: Target,
  },
  high: {
    color: "text-neon-orange",
    bg: "bg-neon-orange/10",
    border: "border-neon-orange/50",
    glow: "glow-pink",
    icon: AlertTriangle,
  },
  urgent: {
    color: "text-neon-red",
    bg: "bg-neon-red/10",
    border: "border-neon-red/50",
    glow: "glow-green",
    icon: Zap,
  },
};

export const TodoList = ({
  todos,
  updateTodo,
  filteredAndSortedTodos,
  setTodos,
  setEditingTodo,
  selectedTodos,
  setSelectedTodos,
}: {
  todos: Todo[];
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  filteredAndSortedTodos: Todo[];
  selectedTodos: Set<string>;
  setEditingTodo: Dispatch<SetStateAction<Todo | null>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setSelectedTodos: Dispatch<SetStateAction<Set<string>>>;
}) => {
  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setSelectedTodos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleComplete = (id: string) => {
    updateTodo(id, { completed: !todos.find((t) => t.id === id)?.completed });
  };

  return (
    <div className="space-y-6">
      {filteredAndSortedTodos.map((todo) => {
        const config = priorityConfig[todo.priority];
        const PriorityIcon = config.icon;
        const isOverdue =
          todo.dueDate && todo.dueDate < new Date() && !todo.completed;

        return (
          <Card
            key={todo.id}
            className={`cyber-card transition-all duration-500 hover:scale-[1.02] ${
              todo.completed
                ? "border-neon-green/30 opacity-60"
                : isOverdue
                ? "border-neon-red/80 glow-pink animate-pulse"
                : `border-${config.color.replace("text-", "")}/50`
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Checkbox
                  checked={selectedTodos.has(todo.id)}
                  onCheckedChange={(checked) => {
                    const newSet = new Set(selectedTodos);
                    if (checked) {
                      newSet.add(todo.id);
                    } else {
                      newSet.delete(todo.id);
                    }
                    setSelectedTodos(newSet);
                  }}
                  className="mt-2 border-2 border-neon-cyan data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan scale-125"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleComplete(todo.id)}
                  className="mt-1 p-0 h-8 w-8 hover:bg-transparent"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="h-7 w-7 text-neon-green glow-green" />
                  ) : (
                    <Circle
                      className={`h-7 w-7 ${config.color} hover:${config.glow} transition-all duration-300`}
                    />
                  )}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      className={`text-xl font-cyber font-bold ${
                        todo.completed
                          ? "line-through text-neon-green/60"
                          : "text-white text-glow-cyan"
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <Badge
                      className={`${config.bg} ${config.color} ${config.border} border-2 font-matrix text-sm px-3 py-1 ${config.glow}`}
                    >
                      <PriorityIcon className="h-4 w-4 mr-2" />
                      {todo.priority.toUpperCase()}
                    </Badge>
                    {isOverdue && (
                      <Badge className="bg-neon-red/20 text-neon-red border-2 border-neon-red font-matrix text-sm px-3 py-1 animate-pulse glow-pink">
                        OVERDUE
                      </Badge>
                    )}
                    {todo.category && (
                      <Badge className="bg-neon-purple/20 text-neon-purple border-2 border-neon-purple/50 font-matrix text-sm px-3 py-1">
                        {todo.category.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  {todo.description && (
                    <p
                      className={`text-base mb-4 font-matrix ${
                        todo.completed
                          ? "text-neon-green/50"
                          : "text-neon-cyan/80"
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm font-matrix">
                    <span className="text-neon-blue">
                      CREATED: {todo.created_at.toLocaleDateString()}
                    </span>
                    <span className="text-neon-purple">
                      UPDATED: {todo.updated_at.toLocaleDateString()}
                    </span>
                    {todo.dueDate && (
                      <span
                        className={`${
                          isOverdue
                            ? "text-neon-red animate-pulse"
                            : "text-neon-yellow"
                        }`}
                      >
                        DUE: {todo.dueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/todo/${todo.id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-neon-cyan hover:text-neon-pink hover:glow-pink transition-all duration-300 border-neon-cyan/50 bg-transparent"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neon-cyan hover:text-neon-pink hover:glow-pink transition-all duration-300"
                      >
                        <MoreVertical className="h-6 w-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-cyber-dark border-2 border-neon-cyan/50">
                      <DropdownMenuItem
                        onClick={() => setEditingTodo(todo)}
                        className="text-neon-cyan hover:bg-neon-cyan/20 font-matrix"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        MODIFY
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteTodo(todo.id)}
                        className="text-neon-red hover:bg-neon-red/20 font-matrix"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        DELETE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
