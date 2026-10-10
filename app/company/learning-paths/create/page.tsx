'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LearningPathSchema, LearningPathTaskSchema, type LearningPathData, type LearningPathTaskData } from '../@/lib/validation/company'
import { createClient } from '../@/lib/supabase/client'

export default function CreateLearningPathPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<'details' | 'tasks'>('details')
  const [pathData, setPathData] = useState<Partial<LearningPathData>>({
    difficulty: 'Beginner'
  })
  const [tasks, setTasks] = useState<Partial<LearningPathTaskData>[]>([{}])

  const handleTaskChange = (index: number, field: keyof LearningPathTaskData, value: any) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], [field]: value }
    setTasks(newTasks)
  }

  const addTask = () => setTasks([...tasks, {}])
  const removeTask = (index: number) => setTasks(tasks.filter((_, i) => i !== index))

  async function savePath() {
    const pathResult = LearningPathSchema.safeParse(pathData)
    if (!pathResult.success) {
      alert('Please check path details')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get organization ID
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (!membership) return

    // 1. Create Learning Path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .insert({
        ...pathResult.data,
        organization_id: membership.organization_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (pathError || !path) {
      alert('Failed to save path')
      return
    }

    // 2. Create Tasks
    const tasksToInsert = tasks.map((t, i) => ({
      ...t,
      plan_id: path.id,
      order_index: i,
    }))

    const { error: tasksError } = await supabase.from('tasks').insert(tasksToInsert)

    if (tasksError) {
      alert('Failed to save tasks')
      return
    }

    router.push('/company/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create Learning Path</h1>
            <p className="text-slate-600">Define a structured growth journey for your team.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep('details')}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${step === 'details' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              1. Details
            </button>
            <button
              onClick={() => setStep('tasks')}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${step === 'tasks' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              2. Tasks
            </button>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          {step === 'details' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Path Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Mastery 2026"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={pathData.title || ''}
                    onChange={(e) => setPathData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Junior React Developer"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={pathData.role || ''}
                    onChange={(e) => setPathData(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the goals and outcomes of this path..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={pathData.description || ''}
                  onChange={(e) => setPathData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Difficulty Level</label>
                  <select
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={pathData.difficulty}
                    onChange={(e) => setPathData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Weeks"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={pathData.estimatedDuration || ''}
                    onChange={(e) => setPathData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                  />
                </div>
              </div>
              <button
                onClick={() => setStep('tasks')}
                className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
              >
                Continue to Tasks →
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-6">
                {tasks.map((task, index) => (
                  <div key={index} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 relative group">
                    <button
                      onClick={() => removeTask(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center"
                    >
                      ×
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Task Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Setup Development Environment"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                            value={task.title || ''}
                            onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                          <textarea
                            rows={2}
                            placeholder="What needs to be achieved?"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                            value={task.description || ''}
                            onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Completion Criteria</label>
                          <input
                            type="text"
                            placeholder="e.g. GitHub repo with first commit"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                            value={task.completionCriteria || ''}
                            onChange={(e) => handleTaskChange(index, 'completionCriteria', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Resources/Links</label>
                          <input
                            type="text"
                            placeholder="URL to documentation..."
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                            value={task.resources || ''}
                            onChange={(e) => handleTaskChange(index, 'resources', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  ← Back to Details
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 py-4 bg-violet-100 text-violet-700 rounded-xl font-bold hover:bg-violet-200 transition-all"
                >
                  + Add Another Task
                </button>
                <button
                  onClick={savePath}
                  className="flex-1 py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
                >
                  Publish Path
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
