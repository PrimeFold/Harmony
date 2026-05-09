export interface Task {
  id: string;
  name: string;
  status: 'todo' | 'active' | 'completed';
  projectId: string;
}