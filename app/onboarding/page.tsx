'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IndividualOnboardingSchema, type IndividualOnboardingData } from '../../lib/validation/onboarding'
import { createClient } from '../../lib/supabase/client'

const STEPS = [
  { id: 'goals', title: 'Your Goals', fields: ['mainGoal', 'interests'] },
  { id: 'style', title: 'Learning Style', fields: ['learningStyle', 'availableDevice'] },
  { id: 'resources', title: 'Resources', fields: ['internetAvailability', 'budget'] },
  { id: 'commitment', title: 'Commitment', fields: ['timeAvailable', 'preferredLanguage'] },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<IndividualOnboardingData>>({})

  const handleInputChange = (field: keyof IndividualOnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  async function completeOnboarding() {
    const result = IndividualOnboardingSchema.safeParse(formData)
    if (!result.success) {
      alert('Please fill in all required fields')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Save preferences to profiles/user_preferences or a new onboarding_data table
    // For now, we update the profile role to 'individual'
    await supabase
      .from('profiles')
      .update({ role: 'individual' })
      .eq('id', user.id)

    router.push('/dashboard')
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          <header className="mb-10 text-center">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Step {currentStep + 1} of {STEPS.length}</span>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">{STEPS[currentStep].title}</h1>
          </header>

          <div className="space-y-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">What is your main goal?</label>
                  <select
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.mainGoal || ''}
                    onChange={(e) => handleInputChange('mainGoal', e.target.value)}
                  >
                    <option value="">Select a goal</option>
                    <option value="career_change">Career Change</option>
                    <option value="skill_up">Upskilling</option>
                    <option value="education">Educational Growth</option>
                    <option value="entrepreneurship">Entrepreneurship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Interests (Select all that apply)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Technology', 'Business', 'Arts', 'Science', 'Health', 'Social Work'].map(interest => (
                      <button
                        key={interest}
                        onClick={() => {
                          const current = formData.interests || []
                          const next = current.includes(interest)
                            ? current.filter(i => i !== interest)
                            : [...current, interest]
                          handleInputChange('interests', next)
                        }}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          formData.interests?.includes(interest)
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">How do you learn best?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['visual', 'auditory', 'kinesthetic', 'reading'].map(style => (
                      <button
                        key={style}
                        onClick={() => handleInputChange('learningStyle', style)}
                        className={`p-3 rounded-xl border capitalize transition-all text-left ${
                          formData.learningStyle === style
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Primary Device Available</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['smartphone', 'laptop', 'tablet', 'both'].map(device => (
                      <button
                        key={device}
                        onClick={() => handleInputChange('availableDevice', device)}
                        className={`p-3 rounded-xl border capitalize transition-all text-left ${
                          formData.availableDevice === device
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {device}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Internet Availability</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['limited', 'stable', 'high-speed'].map(level => (
                      <button
                        key={level}
                        onClick={() => handleInputChange('internetAvailability', level)}
                        className={`p-3 rounded-xl border capitalize transition-all text-left ${
                          formData.internetAvailability === level
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Budget for Learning</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['zero', 'low', 'medium', 'high'].map(budget => (
                      <button
                        key={budget}
                        onClick={() => handleInputChange('budget', budget)}
                        className={`p-3 rounded-xl border capitalize transition-all text-left ${
                          formData.budget === budget
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time available per week</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 hours"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.timeAvailable || ''}
                    onChange={(e) => handleInputChange('timeAvailable', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Language</label>
                  <input
                    type="text"
                    placeholder="English"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.preferredLanguage || 'English'}
                    onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 text-slate-600 font-medium hover:text-slate-900 disabled:opacity-0 transition-all"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
