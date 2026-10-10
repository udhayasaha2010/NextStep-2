import { z } from 'zod'

export const IndividualOnboardingSchema = z.object({
  mainGoal: z.string().min(1, 'Please select a main goal'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'reading']),
  availableDevice: z.enum(['smartphone', 'laptop', 'tablet', 'both']),
  internetAvailability: z.enum(['limited', 'stable', 'high-speed']),
  budget: z.enum(['zero', 'low', 'medium', 'high']),
  timeAvailable: z.string().min(1, 'Please specify your available time'),
  preferredLanguage: z.string().default('English'),
})

export type IndividualOnboardingData = z.infer<typeof IndividualOnboardingSchema>
