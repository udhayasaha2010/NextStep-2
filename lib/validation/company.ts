import { z } from 'zod'

export const LearningPathSchema = z.object({
  title: z.string().min(3, 'Path title is required'),
  description: z.string().min(10, 'Please provide a detailed description'),
  role: z.string().min(1, 'Target role is required'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedDuration: z.string().min(1, 'Estimated duration is required'),
})

export type LearningPathData = z.infer<typeof LearningPathSchema>

export const LearningPathTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Task description is required'),
  orderIndex: z.number().int(),
  completionCriteria: z.string().min(1, 'Completion criteria are required'),
  resources: z.string().optional(),
})

export type LearningPathTaskData = z.infer<typeof LearningPathTaskSchema>
