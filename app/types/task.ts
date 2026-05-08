export interface Task {
  id: string;
  content: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId: string;
  createdAt: Date;
}