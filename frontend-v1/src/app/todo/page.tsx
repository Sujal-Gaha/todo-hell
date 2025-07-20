"use client";

import { MatrixRain } from "@/components/matrix-rain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  CheckCircle2,
  Circle,
  Clock,
  Cpu,
  Edit,
  Eye,
  Filter,
  Home,
  MoreVertical,
  Plus,
  Search,
  Shield,
  SortAsc,
  SortDesc,
  Target,
  Trash2,
  Wifi,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Priority = "low" | "medium" | "high" | "urgent";
type FilterType = "all" | "active" | "completed";
type SortType = "created" | "updated" | "priority" | "title";

interface Todo {
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

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    category: "",
    dueDate: "",
  });
  const [monthFilter, setMonthFilter] = useState<string>("all");

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cyberpunk-todos");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTodos(
        parsed.map((todo: any) => ({
          ...todo,
          created_at: new Date(todo.created_at),
          updated_at: new Date(todo.updated_at),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }))
      );
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("cyberpunk-todos", JSON.stringify(todos));
  }, [todos]);

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

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...updates, updated_at: new Date() } : todo
      )
    );
  };

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

  const filteredAndSortedTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed);

      // Month filter logic
      let matchesMonth = true;
      if (monthFilter !== "all") {
        const todoMonth = `${todo.created_at.getFullYear()}-${String(
          todo.created_at.getMonth() + 1
        ).padStart(2, "0")}`;
        matchesMonth = todoMonth === monthFilter;
      }

      return matchesSearch && matchesFilter && matchesMonth;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "created":
          comparison = a.created_at.getTime() - b.created_at.getTime();
          break;
        case "updated":
          comparison = a.updated_at.getTime() - b.updated_at.getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [todos, searchTerm, filter, monthFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    // Filter todos by month if month filter is active
    const monthFilteredTodos =
      monthFilter === "all"
        ? todos
        : todos.filter((todo) => {
            const todoMonth = `${todo.created_at.getFullYear()}-${String(
              todo.created_at.getMonth() + 1
            ).padStart(2, "0")}`;
            return todoMonth === monthFilter;
          });

    const total =
      monthFilter === "all" ? todos.length : monthFilteredTodos.length;
    const completed =
      monthFilter === "all"
        ? todos.filter((t) => t.completed).length
        : monthFilteredTodos.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = todos.filter(
      (t) => t.dueDate && t.dueDate < new Date() && !t.completed
    ).length;

    const byPriority = {
      urgent: (monthFilter === "all" ? todos : monthFilteredTodos).filter(
        (t) => t.priority === "urgent" && !t.completed
      ).length,
      high: (monthFilter === "all" ? todos : monthFilteredTodos).filter(
        (t) => t.priority === "high" && !t.completed
      ).length,
      medium: (monthFilter === "all" ? todos : monthFilteredTodos).filter(
        (t) => t.priority === "medium" && !t.completed
      ).length,
      low: (monthFilter === "all" ? todos : monthFilteredTodos).filter(
        (t) => t.priority === "low" && !t.completed
      ).length,
    };

    // Monthly breakdown
    const monthlyStats =
      monthFilter !== "all"
        ? {
            monthName: new Date(monthFilter + "-01").toLocaleDateString(
              "en-US",
              { month: "long", year: "numeric" }
            ),
            tasksStarted: monthFilteredTodos.length,
            tasksCompleted: monthFilteredTodos.filter((t) => t.completed)
              .length,
          }
        : null;

    return { total, completed, active, overdue, byPriority, monthlyStats };
  }, [todos, monthFilter]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    todos.forEach((todo) => {
      const month = `${todo.created_at.getFullYear()}-${String(
        todo.created_at.getMonth() + 1
      ).padStart(2, "0")}`;
      months.add(month);
    });
    return Array.from(months).sort().reverse(); // Most recent first
  }, [todos]);

  const completionRate =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen cyber-gradient relative overflow-hidden">
      <MatrixRain />

      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20 z-0">
        <div
          className="absolute inset-0 cyber-grid animate-pulse"
          style={{ backgroundSize: "60px 60px" }}
        />
      </div>

      {/* Lucy Background Character */}
      <div className="fixed bottom-0 right-0 z-0 opacity-30 pointer-events-none">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp11554020.jpg&f=1&nofb=1&ipt=441566dbbadbf38089b62036368d41dd02bda9fb491f132c8d63d824102e7b43"
            alt="Lucy from Cyberpunk Edgerunners"
            className="h-[80vh] w-auto object-contain opacity-60 animate-float"
            style={{
              filter:
                "drop-shadow(0 0 20px rgba(0, 255, 255, 0.3)) drop-shadow(0 0 40px rgba(255, 0, 255, 0.2))",
              animationDuration: "6s",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neon-cyan/10 to-transparent animate-pulse opacity-50" />
        </div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full animate-float opacity-60"
            style={{
              left: `${(i * 19 + 31) % 100}%`,
              top: `${(i * 23 + 41) % 100}%`,
              animationDelay: `${((i * 13 + 17) % 30) / 10}s`,
              animationDuration: `${3 + ((i * 7 + 11) % 20) / 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-7xl">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-cyber-dark" />
                </div>
                <span className="text-2xl font-cyber font-bold text-neon-cyan text-glow-cyan">
                  CYBER TODO
                </span>
              </Link>
              <div className="flex items-center gap-4 text-neon-green font-matrix text-sm">
                <Cpu className="h-4 w-4 animate-pulse" />
                <span>NEURAL DASHBOARD ACTIVE</span>
                <Shield className="h-4 w-4 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-cyber-dark font-cyber"
                >
                  <Home className="h-4 w-4 mr-2" />
                  HOME
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-6xl font-cyber font-black mb-4 glitch text-glow-cyan"
            data-text="NEURAL DASHBOARD"
          >
            <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple bg-clip-text text-transparent">
              NEURAL DASHBOARD
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-neon-cyan text-sm">
            <Wifi className="h-4 w-4 animate-pulse" />
            <span>QUANTUM ENCRYPTED • NEURAL LINKED • REALITY SYNCED</span>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cyber-card border-glow-cyan hover:glow-cyan transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neon-cyan font-matrix mb-1">
                    TOTAL TASKS
                  </p>
                  <p className="text-3xl font-cyber font-bold text-neon-cyan text-glow-cyan">
                    {stats.total}
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-neon-cyan animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card border-glow-green hover:glow-green transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neon-green font-matrix mb-1">
                    COMPLETED
                  </p>
                  <p className="text-3xl font-cyber font-bold text-neon-green text-glow-green">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-neon-green animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card border-glow-purple hover:glow-purple transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neon-purple font-matrix mb-1">
                    ACTIVE
                  </p>
                  <p className="text-3xl font-cyber font-bold text-neon-purple text-glow-purple">
                    {stats.active}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-neon-purple animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card border-glow-pink hover:glow-pink transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neon-pink font-matrix mb-1">
                    OVERDUE
                  </p>
                  <p className="text-3xl font-cyber font-bold text-neon-pink text-glow-pink animate-pulse">
                    {stats.overdue}
                  </p>
                </div>
                <AlertTriangle className="h-10 w-10 text-neon-pink animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Stats Card */}
        {stats.monthlyStats && (
          <Card className="cyber-card border-glow-purple hover:glow-purple transition-all duration-300 mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-neon-purple font-matrix mb-2">
                  MONTHLY ANALYSIS
                </p>
                <p className="text-xl font-cyber font-bold text-neon-purple text-glow-purple mb-4">
                  {stats.monthlyStats.monthName}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neon-cyan font-matrix">
                      Tasks Started
                    </p>
                    <p className="text-2xl font-cyber font-bold text-neon-cyan">
                      {stats.monthlyStats.tasksStarted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neon-green font-matrix">
                      Tasks Completed
                    </p>
                    <p className="text-2xl font-cyber font-bold text-neon-green">
                      {stats.monthlyStats.tasksCompleted}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        <Card className="cyber-card border-glow-cyan mb-8 hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-cyber text-neon-cyan">
                {monthFilter === "all"
                  ? "NEURAL PROGRESS SYNC"
                  : `PROGRESS: ${stats.monthlyStats?.monthName}`}
              </span>
              <span className="text-lg font-matrix text-neon-pink text-glow-pink">
                {completionRate.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <Progress
                value={completionRate}
                className="h-4 bg-cyber-dark border border-neon-cyan/30"
              />
              <div
                className="absolute top-0 left-0 h-4 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full transition-all duration-500 glow-cyan"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
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
                <SelectItem
                  value="all"
                  className="text-neon-purple font-matrix"
                >
                  ALL TASKS
                </SelectItem>
                <SelectItem
                  value="active"
                  className="text-neon-purple font-matrix"
                >
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
                <SelectItem
                  value="created"
                  className="text-neon-pink font-matrix"
                >
                  CREATED
                </SelectItem>
                <SelectItem
                  value="updated"
                  className="text-neon-pink font-matrix"
                >
                  UPDATED
                </SelectItem>
                <SelectItem
                  value="priority"
                  className="text-neon-pink font-matrix"
                >
                  PRIORITY
                </SelectItem>
                <SelectItem
                  value="title"
                  className="text-neon-pink font-matrix"
                >
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

        {/* Bulk Actions */}
        {selectedTodos.size > 0 && (
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
        )}

        {/* Todo List */}
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

        {filteredAndSortedTodos.length === 0 && (
          <Card className="cyber-card border-glow-purple">
            <CardContent className="p-12 text-center">
              <div className="text-neon-purple mb-6">
                <Archive className="h-16 w-16 mx-auto mb-6 opacity-60 animate-float" />
                <p className="text-2xl font-cyber font-bold text-glow-purple mb-2">
                  NO TASKS DETECTED
                </p>
                <p className="text-lg font-matrix text-neon-cyan/60">
                  Initialize your first neural task to begin
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
          <DialogContent className="bg-cyber-dark border-2 border-neon-pink/50 text-neon-pink max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-cyber text-neon-pink text-glow-pink">
                NEURAL TASK MODIFICATION
              </DialogTitle>
            </DialogHeader>
            {editingTodo && (
              <div className="space-y-6">
                <Input
                  value={editingTodo.title}
                  onChange={(e) =>
                    setEditingTodo((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="bg-cyber-darker border-2 border-neon-pink/30 text-neon-pink font-matrix focus:border-neon-pink focus:glow-pink"
                />
                <Textarea
                  value={editingTodo.description}
                  onChange={(e) =>
                    setEditingTodo((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  className="bg-cyber-darker border-2 border-neon-pink/30 text-neon-pink font-matrix focus:border-neon-pink focus:glow-pink"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={editingTodo.priority}
                    onValueChange={(value: Priority) =>
                      setEditingTodo((prev) =>
                        prev ? { ...prev, priority: value } : null
                      )
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
                    value={
                      editingTodo.dueDate
                        ? editingTodo.dueDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditingTodo((prev) =>
                        prev
                          ? {
                              ...prev,
                              dueDate: e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            }
                          : null
                      )
                    }
                    className="bg-cyber-darker border-2 border-neon-cyan/30 text-neon-cyan font-matrix focus:border-neon-cyan"
                  />
                </div>
                <Input
                  placeholder="CATEGORY TAG..."
                  value={editingTodo.category || ""}
                  onChange={(e) =>
                    setEditingTodo((prev) =>
                      prev ? { ...prev, category: e.target.value } : null
                    )
                  }
                  className="bg-cyber-darker border-2 border-neon-green/30 text-neon-green font-matrix focus:border-neon-green"
                />
                <Button
                  onClick={() => {
                    if (editingTodo) {
                      updateTodo(editingTodo.id, editingTodo);
                      setEditingTodo(null);
                    }
                  }}
                  className="w-full h-12 cyber-button font-cyber font-bold text-cyber-dark"
                >
                  UPDATE NEURAL LINK
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TodoPage;
