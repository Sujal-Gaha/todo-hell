import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Filter, Plus, Search, SortAsc, SortDesc } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { SortOrder, SortType } from "../types/sort";
import { FilterType } from "../types/filter";
import { Priority, Todo } from "../types/todo";

export const ControlSection = ({
  availableMonths,
  monthFilter,
  sortBy,
  filter,
  sortOrder,
  searchTerm,
  todos,
  setSortBy,
  setTodos,
  setFilter,
  setSortOrder,
  setSearchTerm,
  setMonthFilter,
}: {
  availableMonths: string[];
  monthFilter: string;
  sortBy: SortType;
  filter: FilterType;
  sortOrder: SortOrder;
  searchTerm: string;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setMonthFilter: Dispatch<SetStateAction<string>>;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
  setSortBy: Dispatch<SetStateAction<SortType>>;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    category: "",
    dueDate: "",
  });

  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: newTodo.title,
      description: newTodo.description,
      completed: false,
      priority: newTodo.priority,
      created_at: new Date(),
      updated_at: new Date(),
      category: newTodo.category || undefined,
      dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : undefined,
    };

    setTodos((prev) => [todo, ...prev]);
    setNewTodo({
      title: "",
      description: "",
      priority: "medium",
      category: "",
      dueDate: "",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan h-5 w-5" />
        <Input
          placeholder="SEARCH NEURAL DATABASE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 bg-cyber-dark/80 border-2 border-neon-cyan/50 text-neon-cyan placeholder-neon-cyan/60 font-matrix focus:border-neon-cyan focus:glow-cyan transition-all duration-300"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={filter}
          onValueChange={(value: FilterType) => setFilter(value)}
        >
          <SelectTrigger className="w-40 h-12 bg-cyber-dark/80 border-2 border-neon-purple/50 text-neon-purple font-matrix hover:border-neon-purple hover:glow-purple transition-all duration-300">
            <Filter className="h-5 w-5 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-cyber-dark border-2 border-neon-purple/50">
            <SelectItem value="all" className="text-neon-purple font-matrix">
              ALL TASKS
            </SelectItem>
            <SelectItem value="active" className="text-neon-purple font-matrix">
              ACTIVE
            </SelectItem>
            <SelectItem
              value="completed"
              className="text-neon-purple font-matrix"
            >
              COMPLETED
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value: SortType) => setSortBy(value)}
        >
          <SelectTrigger className="w-40 h-12 bg-cyber-dark/80 border-2 border-neon-pink/50 text-neon-pink font-matrix hover:border-neon-pink hover:glow-pink transition-all duration-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-cyber-dark border-2 border-neon-pink/50">
            <SelectItem value="created" className="text-neon-pink font-matrix">
              CREATED
            </SelectItem>
            <SelectItem value="updated" className="text-neon-pink font-matrix">
              UPDATED
            </SelectItem>
            <SelectItem value="priority" className="text-neon-pink font-matrix">
              PRIORITY
            </SelectItem>
            <SelectItem value="title" className="text-neon-pink font-matrix">
              TITLE
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="h-12 w-12 bg-cyber-dark/80 border-2 border-neon-green/50 text-neon-green hover:border-neon-green hover:glow-green transition-all duration-300"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="h-5 w-5" />
          ) : (
            <SortDesc className="h-5 w-5" />
          )}
        </Button>

        <Select
          value={monthFilter}
          onValueChange={(value: string) => setMonthFilter(value)}
        >
          <SelectTrigger className="w-48 h-12 bg-cyber-dark/80 border-2 border-neon-green/50 text-neon-green font-matrix hover:border-neon-green hover:glow-green transition-all duration-300">
            <Clock className="h-5 w-5 mr-2" />
            <SelectValue placeholder="SELECT MONTH" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-dark border-2 border-neon-green/50">
            <SelectItem value="all" className="text-neon-green font-matrix">
              ALL MONTHS
            </SelectItem>
            {availableMonths.map((month) => {
              const date = new Date(month + "-01");
              const monthName = date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
              const taskCount = todos.filter((todo) => {
                const todoMonth = `${todo.created_at.getFullYear()}-${String(
                  todo.created_at.getMonth() + 1
                ).padStart(2, "0")}`;
                return todoMonth === month;
              }).length;

              return (
                <SelectItem
                  key={month}
                  value={month}
                  className="text-neon-green font-matrix"
                >
                  {monthName} ({taskCount} tasks)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Add Todo Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="h-12 px-8 cyber-button font-cyber font-bold text-cyber-dark hover:scale-105 transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            INITIALIZE TASK
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-cyber-dark border-2 border-neon-cyan/50 text-neon-cyan max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-cyber text-neon-cyan text-glow-cyan">
              NEURAL TASK CREATION
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Input
              placeholder="TASK DESIGNATION..."
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo((prev) => ({ ...prev, title: e.target.value }))
              }
              className="bg-cyber-darker border-2 border-neon-cyan/30 text-neon-cyan font-matrix focus:border-neon-cyan focus:glow-cyan"
            />
            <Textarea
              placeholder="TASK PARAMETERS..."
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="bg-cyber-darker border-2 border-neon-cyan/30 text-neon-cyan font-matrix focus:border-neon-cyan focus:glow-cyan"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={newTodo.priority}
                onValueChange={(value: Priority) =>
                  setNewTodo((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="bg-cyber-darker border-2 border-neon-purple/30 text-neon-purple font-matrix">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-cyber-dark border-2 border-neon-purple/50">
                  <SelectItem
                    value="low"
                    className="text-neon-blue font-matrix"
                  >
                    LOW PRIORITY
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="text-neon-yellow font-matrix"
                  >
                    MEDIUM PRIORITY
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="text-neon-orange font-matrix"
                  >
                    HIGH PRIORITY
                  </SelectItem>
                  <SelectItem
                    value="urgent"
                    className="text-neon-red font-matrix"
                  >
                    URGENT
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) =>
                  setNewTodo((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                className="bg-cyber-darker border-2 border-neon-pink/30 text-neon-pink font-matrix focus:border-neon-pink"
              />
            </div>
            <Input
              placeholder="CATEGORY TAG..."
              value={newTodo.category}
              onChange={(e) =>
                setNewTodo((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="bg-cyber-darker border-2 border-neon-green/30 text-neon-green font-matrix focus:border-neon-green"
            />
            <Button
              onClick={addTodo}
              className="w-full h-12 cyber-button font-cyber font-bold text-cyber-dark"
            >
              DEPLOY TASK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
