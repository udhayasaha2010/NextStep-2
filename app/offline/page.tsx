'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <div className="text-6xl mb-6">📶</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">You're Currently Offline</h1>
        <p className="text-slate-600 mb-8">
          It looks like you've lost your internet connection. Don't worry—your saved action plans and tasks are still available.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Try Reconnecting
        </button>
      </div>
    </div>
  )
}
