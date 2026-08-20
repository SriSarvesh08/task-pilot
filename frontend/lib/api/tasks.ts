import { api } from '../api';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  projectId: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: string | null;
}

export interface GetTasksQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const tasksApi = {
  getTasks: async (params?: GetTasksQuery) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value as string);
      });
    }
    const queryString = query.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return api.get<{ data: Task[]; total: number }>(endpoint);
  },
  
  getTask: async (id: string) => {
    return api.get<Task>(`/tasks/${id}`);
  },
  
  createTask: async (data: CreateTaskInput) => {
    return api.post<Task>('/tasks', data);
  },
  
  updateTask: async (id: string, data: UpdateTaskInput) => {
    return api.patch<Task>(`/tasks/${id}`, data);
  },
  
  deleteTask: async (id: string) => {
    return api.delete<{ success: boolean }>(`/tasks/${id}`);
  },
};
