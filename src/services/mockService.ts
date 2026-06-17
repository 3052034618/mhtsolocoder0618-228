import { users, projects, User, UserRole, Project, ProjectStatus } from './mockData';

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const authService = {
  async login(role: UserRole): Promise<User> {
    const user = users.find((u) => u.role === role);
    if (!user) {
      throw new Error('User not found');
    }
    return delay(user);
  },

  async logout(): Promise<void> {
    return delay(undefined);
  },

  async getCurrentUser(): Promise<User | null> {
    return delay(null);
  },
};

export const projectService = {
  async fetchProjects(filters?: { status?: ProjectStatus; keyword?: string }): Promise<Project[]> {
    let result = [...projects];
    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.requirements.some((r) => r.toLowerCase().includes(kw))
      );
    }
    return delay(result);
  },

  async fetchProjectById(id: string): Promise<Project | null> {
    const project = projects.find((p) => p.id === id) || null;
    return delay(project);
  },

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<Project | null> {
    const project = projects.find((p) => p.id === id);
    if (project) {
      project.status = status;
    }
    return delay(project || null);
  },
};
