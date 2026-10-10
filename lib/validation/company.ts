import { z } from 'zod'

export const CompanyOnboardingSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  officialEmail: z.string().email('Please provide a valid official company email'),
  industry: z.string().min(1, 'Industry is required'),
  organizationSize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  country: z.string().min(1, 'Country is required'),
  website: z.string().url('Please provide a valid website URL').optional().or(z.literal('')),
  adminRole: z.enum(['owner', 'admin', 'manager']),
})

export type CompanyOnboardingData = z.infer<typeof CompanyOnboardingSchema>

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
