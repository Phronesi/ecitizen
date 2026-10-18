export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <div className="flag-ribbon w-full" />
      
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/ecitizen-logo.jpg" 
              alt="eCitizen Kenya" 
              className="h-10 w-auto object-contain"
            />
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                HudumaTrack
              </h1>
              <span className="text-xs text-slate-500 font-medium">
                Public Service Request Desk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              System Online
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            HudumaTrack Public Service Request Desk
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Republic of Kenya unified platform for submitting, tracking, and resolving citizen service requests across all 47 counties.
          </p>
        </div>
      </main>
    </div>
  )
}
