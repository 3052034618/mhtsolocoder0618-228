import { create } from 'zustand';
import { projectService } from '../services/mockService';
import { Project, ProjectStatus } from '../services/mockData';

interface ProjectFilters {
  status?: ProjectStatus;
  keyword?: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  filters: ProjectFilters;
  isLoading: boolean;

  fetchProjects: (filters?: ProjectFilters) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  setFilters: (filters: ProjectFilters) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  filters: {},
  isLoading: false,

  fetchProjects: async (filters?: ProjectFilters) => {
    set({ isLoading: true });
    try {
      const mergedFilters = { ...get().filters, ...filters };
      const projects = await projectService.fetchProjects(mergedFilters);
      set({ projects, filters: mergedFilters, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  setFilters: (filters: ProjectFilters) => {
    set({ filters });
  },

  updateProjectStatus: async (id: string, status: ProjectStatus) => {
    set({ isLoading: true });
    try {
      const updated = await projectService.updateProjectStatus(id, status);
      if (updated) {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updated : p)),
          currentProject: state.currentProject?.id === id ? updated : state.currentProject,
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true });
    try {
      const project = await projectService.fetchProjectById(id);
      if (project) {
        set({ currentProject: project, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return project;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
