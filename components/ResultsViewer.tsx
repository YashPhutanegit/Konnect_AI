import React from 'react';
import { ExecutionResults } from '../types';
import { FileText, MessageSquare, AlertTriangle, GitCommit, User } from 'lucide-react';

interface ResultsViewerProps {
  results: ExecutionResults;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({ results }) => {
  return (
    <div className="space-y-6">
      
      {/* Simulation Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Detected Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-3">
             <div className="bg-red-200 p-1.5 rounded text-red-700">
                <AlertTriangle size={18} />
             </div>
             <div>
               <div className="text-xs text-red-600 font-semibold">Priority Bug</div>
               <div className="text-sm text-slate-900 font-medium">{results.bugSummary}</div>
             </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
             <div className="bg-slate-200 p-1.5 rounded text-slate-700">
                <GitCommit size={18} />
             </div>
             <div>
               <div className="text-xs text-slate-500 font-semibold">Affected Component</div>
               <div className="text-sm text-slate-900 font-mono font-medium">{results.detectedComponent}</div>
             </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
             <div className="bg-slate-200 p-1.5 rounded text-slate-700">
                <GitCommit size={18} />
             </div>
             <div>
               <div className="text-xs text-slate-500 font-semibold">Last Commit</div>
               <div className="text-sm text-slate-900 font-mono">{results.commitHash.substring(0, 8)}...</div>
             </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
             <div className="bg-slate-200 p-1.5 rounded text-slate-700">
                <User size={18} />
             </div>
             <div>
               <div className="text-xs text-slate-500 font-semibold">Developer</div>
               <div className="text-sm text-slate-900">{results.developerName}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Simulated Google Doc */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
          <FileText className="text-white w-5 h-5" />
          <div className="text-white font-medium">Google Docs Simulation</div>
          <div className="ml-auto text-blue-100 text-xs bg-blue-700 px-2 py-0.5 rounded">
            {results.docEntryId}
          </div>
        </div>
        <div className="p-8 bg-white min-h-[200px]">
          <div className="max-w-2xl mx-auto shadow-sm border border-gray-100 p-8 bg-white">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Release Notes: Hotfix v2.4.1</h1>
            <div className="prose prose-sm text-gray-600 whitespace-pre-line">
              {results.docContent}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Slack Message */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#4A154B] px-4 py-3 flex items-center gap-3">
          <MessageSquare className="text-white w-5 h-5" />
          <div className="text-white font-medium">Slack Simulation</div>
          <div className="ml-auto text-purple-200 text-xs font-mono">
            {results.slackChannel}
          </div>
        </div>
        <div className="p-6 bg-slate-50">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded bg-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              CP
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-900">C-PEOF Agent</span>
                <span className="text-xs text-slate-500">APP 2:45 PM</span>
              </div>
              <div className="mt-1 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                {results.slackMessage}
              </div>
              <div className="mt-3 border-l-4 border-emerald-500 pl-3 py-1">
                <div className="text-xs font-semibold text-slate-500">Attachment</div>
                <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Open Release Notes ({results.docEntryId})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};