import React from 'react';
import { OrchestrationStep, SystemType } from '../types';
import { CheckCircle2, GitBranch, FileText, MessageSquare, Search, LayoutDashboard } from 'lucide-react';

interface PlanViewerProps {
  steps: OrchestrationStep[];
}

const getSystemIcon = (system: SystemType) => {
  switch (system) {
    case SystemType.JIRA: return <LayoutDashboard className="w-5 h-5 text-blue-500" />;
    case SystemType.GITHUB: return <GitBranch className="w-5 h-5 text-gray-800" />;
    case SystemType.DOCS: return <FileText className="w-5 h-5 text-blue-600" />;
    case SystemType.SLACK: return <MessageSquare className="w-5 h-5 text-purple-600" />;
    case SystemType.ANALYSIS: return <Search className="w-5 h-5 text-indigo-500" />;
    default: return <Search className="w-5 h-5" />;
  }
};

export const PlanViewer: React.FC<PlanViewerProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Orchestration Plan</h2>
        <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
          {steps.length} Steps
        </span>
      </div>
      <div className="p-6">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200" />

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.stepNumber} className="relative flex items-start group">
                {/* Step Circle */}
                <div className="absolute left-0 w-12 flex justify-center bg-white">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center z-10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="ml-16 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Step {step.stepNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                      {getSystemIcon(step.system)}
                      {step.system}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{step.action}</h3>
                  <p className="text-xs text-slate-500 mt-1 italic border-l-2 border-slate-300 pl-2">
                    {step.dataFlow}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};