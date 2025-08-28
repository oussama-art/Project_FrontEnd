import type { User } from './User'

export interface Task {
  id: number
  title: string
  description?: string | null
  status: 'todo' | 'in_progress' | 'done'
  assigned_to?: User | null
  project_id?: number
  created_at: string
}
