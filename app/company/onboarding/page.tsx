'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CompanyOnboardingSchema, type CompanyOnboardingData } from '../../../lib/validation/company'
import { createClient } from '../../../lib/supabase/client'

const STEPS = [
  { id: 'basic', title: 'Company Basics', fields: ['companyName', 'officialEmail', 'website'] },
  { id: 'details', title: 'Organization Details', fields: ['industry', 'organizationSize', 'country'] },
  { id: 'admin', title: 'Administrative Role', fields: ['adminRole'] },
]

export default function CompanyOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CompanyOnboardingData>>({})

  const handleInputChange = (field: keyof CompanyOnboardingData, value: any) => {
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
    const result = CompanyOnboardingSchema.safeParse(formData)
    if (!result.success) {
      alert('Please fill in all required fields correctly')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Create the organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: formData.companyName,
        official_email: formData.officialEmail,
        industry: formData.industry,
        size: formData.organizationSize,
        country: formData.country,
        website: formData.website,
      })
      .select()
      .single()

    if (orgError || !org) {
      alert('Failed to create organization')
      return
    }

    // 2. Add user as a member with the selected role
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: formData.adminRole,
      })

    if (memberError) {
      alert('Failed to assign administrative role')
      return
    }

    // 3. Update profile role
    await supabase
      .from('profiles')
      .update({ role: 'company_admin' })
      .eq('id', user.id)

    router.push('/company/dashboard')
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-violet-100">
        <div className="h-2 bg-slate-100 w-full">
          <div
            className="h-full bg-violet-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          <header className="mb-10 text-center">
            <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Company Setup: Step {currentStep + 1} of {STEPS.length}</span>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">{STEPS[currentStep].title}</h1>
          </header>

          <div className="space-y-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Official Company Email</label>
                  <input
                    type="email"
                    placeholder="hr@acme.com"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.officialEmail || ''}
                    onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Website (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://acme.com"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineering"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.industry || ''}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Organization Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['1-10', '11-50', '51-200', '201-1000', '1000+'].map(size => (
                      <button
                        key={size}
                        onClick={() => handleInputChange('organizationSize', size)}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          formData.organizationSize === size
                            ? 'bg-violet-50 border-violet-500 text-violet-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'
                        }`}
                      >
                        {size} employees
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                  <input
                    type="text"
                    placeholder="United States"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Administrative Role</label>
                <div className="grid grid-cols-1 gap-3">
                  {['owner', 'admin', 'manager'].map(role => (
                    <button
                      key={role}
                      onClick={() => handleInputChange('adminRole', role)}
                      className={`p-4 rounded-2xl border transition-all text-left capitalize flex justify-between items-center ${
                        formData.adminRole === role
                          ? 'bg-violet-50 border-violet-500 text-violet-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'
                      }`}
                    >
                      <span>{role}</span>
                      {formData.adminRole === role && <div className="w-2 h-2 bg-violet-600 rounded-full" />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 italic">
                  Your role determines your access level to team members, learning paths, and reports.
                </p>
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
              className="px-8 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
            >
              {currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
