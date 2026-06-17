import {
  projects,
  type Project,
  type Milestone,
  type ProjectStatus,
  type MilestoneStatus,
  type ListingType,
  type Platform,
} from './mockData';

function delay<T>(data: T, ms: number = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

export interface ProjectsFilter {
  keyword?: string;
  brandId?: string;
  creatorId?: string;
  status?: ProjectStatus | ProjectStatus[];
  type?: ListingType;
  platform?: Platform;
  startDateFrom?: string;
  startDateTo?: string;
}

export interface ProjectsPagination {
  page?: number;
  pageSize?: number;
}

export interface ProjectsResult {
  list: Project[];
  total: number;
  page: number;
  pageSize: number;
}

export function getProjects(
  filter: ProjectsFilter = {},
  pagination: ProjectsPagination = {},
): Promise<ProjectsResult> {
  let filtered = [...projects];

  if (filter.keyword) {
    const kw = filter.keyword.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw),
    );
  }
  if (filter.brandId) {
    filtered = filtered.filter((p) => p.brandId === filter.brandId);
  }
  if (filter.creatorId) {
    filtered = filtered.filter((p) => p.creatorId === filter.creatorId);
  }
  if (filter.status) {
    const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
    filtered = filtered.filter((p) => statuses.includes(p.status));
  }
  if (filter.type) {
    filtered = filtered.filter((p) => p.type === filter.type);
  }
  if (filter.platform) {
    filtered = filtered.filter((p) => p.platform === filter.platform);
  }
  if (filter.startDateFrom) {
    filtered = filtered.filter((p) => p.startDate >= filter.startDateFrom!);
  }
  if (filter.startDateTo) {
    filtered = filtered.filter((p) => p.startDate <= filter.startDateTo!);
  }

  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const pagedList = filtered.slice(start, start + pageSize);

  return delay({
    list: pagedList,
    total: filtered.length,
    page,
    pageSize,
  });
}

export function getProjectById(id: string): Promise<Project | null> {
  const project = projects.find((p) => p.id === id) ?? null;
  return delay(project);
}

export interface CreateMilestoneInput {
  title: string;
  description: string;
  dueDate: string;
  deliverables: string[];
}

export interface CreateProjectInput {
  brandId: string;
  creatorId: string;
  title: string;
  description: string;
  type: ListingType;
  budget: number;
  platform: Platform;
  startDate: string;
  endDate: string;
  milestones: CreateMilestoneInput[];
  requirements: string[];
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  const projectId = `proj${Date.now()}`;
  const milestones: Milestone[] = input.milestones.map((m, index) => ({
    id: `m${Date.now()}_${index}`,
    projectId,
    title: m.title,
    description: m.description,
    dueDate: m.dueDate,
    status: 'pending',
    deliverables: m.deliverables,
  }));

  const newProject: Project = {
    id: projectId,
    brandId: input.brandId,
    creatorId: input.creatorId,
    title: input.title,
    description: input.description,
    type: input.type,
    budget: input.budget,
    status: 'pending',
    platform: input.platform,
    startDate: input.startDate,
    endDate: input.endDate,
    milestones,
    requirements: input.requirements,
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  return delay(newProject, 500);
}

export function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<Project | null> {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return delay(null);

  project.status = status;
  const now = new Date().toISOString();
  if (status === 'signed' && !project.signedAt) {
    project.signedAt = now;
  }
  if (status === 'completed' && !project.completedAt) {
    project.completedAt = now;
  }

  return delay(project);
}

export function updateProject(
  projectId: string,
  patch: Partial<Omit<Project, 'id' | 'milestones' | 'createdAt'>>,
): Promise<Project | null> {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return delay(null);

  Object.assign(project, patch);
  return delay(project);
}

export function updateMilestone(
  projectId: string,
  milestoneId: string,
  patch: Partial<Omit<Milestone, 'id' | 'projectId'>>,
): Promise<Milestone | null> {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return delay(null);

  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return delay(null);

  if (patch.status === 'approved' && !milestone.approvedAt) {
    milestone.approvedAt = new Date().toISOString();
  }
  if (patch.status === 'submitted' && !milestone.submittedAt) {
    milestone.submittedAt = new Date().toISOString();
  }

  Object.assign(milestone, patch);
  return delay(milestone);
}

export interface SubmitContentInput {
  milestoneId: string;
  content: string;
}

export function submitContent(
  projectId: string,
  milestoneId: string,
  content: string,
): Promise<Milestone | null> {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return delay(null);

  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return delay(null);

  milestone.status = 'submitted';
  milestone.submittedContent = content;
  milestone.submittedAt = new Date().toISOString();

  return delay(milestone, 500);
}

export function approveMilestone(
  projectId: string,
  milestoneId: string,
  feedback?: string,
): Promise<Milestone | null> {
  return updateMilestone(projectId, milestoneId, {
    status: 'approved',
    feedback,
  });
}

export function rejectMilestone(
  projectId: string,
  milestoneId: string,
  feedback: string,
): Promise<Milestone | null> {
  return updateMilestone(projectId, milestoneId, {
    status: 'rejected',
    feedback,
  });
}

export function getProjectMilestones(projectId: string): Promise<Milestone[]> {
  const project = projects.find((p) => p.id === projectId);
  return delay(project ? project.milestones : []);
}
