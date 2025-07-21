"use client";

import { MatrixRain } from "@/components/matrix-rain";
import { useEffect, useMemo, useState } from "react";
import { TodoPageNavbar } from "./components/Navbar";
import { TodoPageHeader } from "./components/Header";
import { StatsDashboard } from "./components/StatsDashboard";
import { MonthlyStatsCard } from "./components/MonthlyStatsCard";
import { ProgressBar } from "./components/ProgressBar";
import { FilterType } from "./types/filter";
import { SortOrder, SortType } from "./types/sort";
import { Todo } from "./types/todo";
import { ControlSection } from "./components/ControlSection";
import { NoTaskDetected } from "./components/NoTaskDetected";
import { TodoList } from "./components/TodoList";
import { useEditingTodoDialog } from "./hooks/useEditingTodoDialog";
import { BulkActions } from "./components/BulkActions";

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [monthFilter, setMonthFilter] = useState<string>("all");

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cyberpunk-todos");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTodos(
        parsed.map((todo: Todo) => ({
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

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...updates, updated_at: new Date() } : todo
      )
    );
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

  const { EditingTodoDialogNode } = useEditingTodoDialog({
    editingTodo,
    setEditingTodo,
    updateTodo,
  });

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
        <TodoPageNavbar />
        <TodoPageHeader />
        <StatsDashboard stats={stats} />

        {stats.monthlyStats && (
          <MonthlyStatsCard monthlyStats={stats.monthlyStats} />
        )}

        <ProgressBar
          completionRate={completionRate}
          monthFilter={monthFilter}
          monthName={stats.monthlyStats?.monthName || ""}
        />

        <ControlSection
          availableMonths={availableMonths}
          filter={filter}
          monthFilter={monthFilter}
          searchTerm={searchTerm}
          setFilter={setFilter}
          setMonthFilter={setMonthFilter}
          setSearchTerm={setSearchTerm}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          setTodos={setTodos}
          sortBy={sortBy}
          sortOrder={sortOrder}
          todos={todos}
        />

        {selectedTodos.size > 0 && (
          <BulkActions
            selectedTodos={selectedTodos}
            setSelectedTodos={setSelectedTodos}
            setTodos={setTodos}
            todos={todos}
            updateTodo={updateTodo}
          />
        )}

        <TodoList
          filteredAndSortedTodos={filteredAndSortedTodos}
          selectedTodos={selectedTodos}
          setEditingTodo={setEditingTodo}
          setSelectedTodos={setSelectedTodos}
          setTodos={setTodos}
          todos={todos}
          updateTodo={updateTodo}
        />

        {filteredAndSortedTodos.length === 0 && <NoTaskDetected />}

        {EditingTodoDialogNode}
      </div>
    </div>
  );
};

export default TodoPage;
