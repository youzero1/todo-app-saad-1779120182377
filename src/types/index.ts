export type FilterType = 'all' | 'active' | 'completed';

export type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
};
