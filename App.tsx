import React, { useState, useCallback } from 'react';
import { SimulationState, AgentResponse } from './types';
import { analyzeAndOrchestrate } from './services/geminiService';
import { PlanViewer } from './components/PlanViewer';
import { ResultsViewer } from './components/ResultsViewer';
import { Bot, Upload, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<SimulationState>({ status: 'idle' });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setState({ status: 'uploading' });

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1]; // Remove data:image/png;base64, prefix

      setState({ 
        status: 'analyzing', 
        imagePreview: base64String 
      });

      try {
        const response: AgentResponse = await analyzeAndOrchestrate(base64Data);
        setState({
          status: 'complete',
          imagePreview: base64String,
          response
        });
      } catch (error) {
        setState({
          status: 'error',
          errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
          imagePreview: base64String
        });
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = () => {
    setState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">C-PEOF Agent</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Ecosystem Orchestrator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-400 font-mono hidden md:block">
               v1.0.4 • Connected: Jira, GitHub, Docs, Slack
             </div>
             {state.status === 'complete' && (
               <button 
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
               >
                 New Simulation
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error State */}
        {state.status === 'error' && (
           <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
             <AlertCircle className="text-red-500" />
             <div className="flex-1">
               <h3 className="text-sm font-bold text-red-800">Simulation Failed</h3>
               <p className="text-sm text-red-600">{state.errorMessage}</p>
             </div>
             <button onClick={handleReset} className="text-sm font-medium text-red-700 hover:underline">Try Again</button>
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Plan */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Input Section */}
            <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all ${state.status === 'idle' ? 'ring-4 ring-indigo-50/50' : ''}`}>
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Workflow Input
              </h2>
              
              {state.imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={state.imagePreview} alt="Uploaded Context" className="w-full h-auto object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-mono bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                      Analyzing Multimodal Context...
                    </span>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <p className="mb-2 text-sm text-slate-700 font-medium">Click to upload Jira Board or Diagram</p>
                    <p className="text-xs text-slate-500 max-w-[200px]">
                      The agent will analyze the visual data to extract tickets, components, and status.
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              )}

              {/* Status Indicators */}
              {(state.status === 'analyzing' || state.status === 'uploading') && (
                <div className="mt-6 flex items-center justify-center gap-3 text-indigo-600 bg-indigo-50 py-3 rounded-lg animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">
                    {state.status === 'uploading' ? 'Uploading Context...' : 'Orchestrating Workflow...'}
                  </span>
                </div>
              )}
            </div>

            {/* Plan Visualization (Only if complete) */}
            {state.status === 'complete' && state.response && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-forwards">
                 <PlanViewer steps={state.response.orchestrationPlan} />
              </div>
            )}
          </div>

          {/* Right Column: Execution Results */}
          <div className="lg:col-span-7">
             {state.status === 'idle' || state.status === 'analyzing' || state.status === 'uploading' ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                    <LayoutDashboard className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Orchestrate</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Upload a screenshot of your Jira board, GitHub repo, or Architecture diagram. The C-PEOF Agent will autonomously plan and execute the release workflow.
                  </p>
                </div>
             ) : (
                state.response && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-forwards">
                     <div className="mb-6 flex items-center justify-between">
                       <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         Simulated Execution Results
                       </h2>
                       <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                         EXECUTION SUCCESSFUL
                       </span>
                     </div>
                     <ResultsViewer results={state.response.executionResults} />
                  </div>
                )
             )}
          </div>

        </div>
      </main>
    </div>
  );
}

function LayoutDashboard({ className }: { className?: string }) {
  // Simple fallback icon for empty state
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}