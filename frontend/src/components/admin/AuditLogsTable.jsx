import React from 'react';

const AuditLogsTable = ({ auditLogs = [], loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-500 font-medium text-xs">Loading Security Audit Logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs text-center">
        <p className="text-rose-600 font-semibold text-xs">Error loading audit logs: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Security & Activity Audit Logs</h2>
          <p className="text-slate-500 text-xs mt-0.5">Real-time log of student logins, proctoring events, and exam submissions</p>
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
          {auditLogs.length} Events Logged
        </span>
      </div>

      {auditLogs.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-slate-500 font-semibold text-xs">No audit logs available for your managed exams.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Event Type</th>
                <th className="py-3.5 px-6">User / Student</th>
                <th className="py-3.5 px-6">Activity Description</th>
                <th className="py-3.5 px-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {auditLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-all">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      log.type === 'login' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      log.type === 'exam_submission' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {(log.type || 'Activity').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{log.user || 'N/A'}</span>
                    <span className="text-[10px] text-slate-400">{log.email || ''}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {log.action || 'User activity recorded'}
                    {log.exam ? ` (${log.exam})` : ''}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogsTable;