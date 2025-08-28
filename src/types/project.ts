import type { User } from './user'
import type { Task } from './Task'

export interface Project {
  id: number
  title: string
  description?: string | null
  owner: User
  tasks: Task[]
  created_at: string
}
