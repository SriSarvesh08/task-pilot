import { api } from '../api';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  taskCount?: number;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export const projectsApi = {
  getProjects: async () => {
    return api.get<Project[]>('/projects');
  },
  
  getProject: async (id: string) => {
    return api.get<Project>(`/projects/${id}`);
  },
  
  createProject: async (data: CreateProjectInput) => {
    return api.post<Project>('/projects', data);
  },
  
  updateProject: async (id: string, data: UpdateProjectInput) => {
    return api.patch<Project>(`/projects/${id}`, data);
  },
  
  deleteProject: async (id: string) => {
    return api.delete<{ success: boolean }>(`/projects/${id}`);
  },
};
