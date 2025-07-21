export type TMonthlyStat = {
  monthName: string;
  tasksStarted: number;
  tasksCompleted: number;
};

export type TStat = {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  byPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  monthlyStats: TMonthlyStat | null;
};
