import { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity } from 'lucide-react'
import './index.css'

function App() {
  const [serverStatus, setServerStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test backend connection
    axios.get('/api/health/')
      .then(res => {
        setServerStatus(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Backend connection failed", err)
        setServerStatus({ success: false, message: "Could not connect to backend API" })
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MedCode</h1>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 font-medium">Phase 1: Project Initialization</p>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Frontend Status</h2>
            <div className="flex items-center gap-2 text-green-600">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-medium">React + Vite is running</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Backend Status</h2>
            {loading ? (
              <div className="text-blue-600 animate-pulse font-medium">Checking connection...</div>
            ) : serverStatus?.success ? (
              <div className="flex items-center gap-2 text-green-600">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-medium">API is connected ({serverStatus.version})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-medium">API disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
