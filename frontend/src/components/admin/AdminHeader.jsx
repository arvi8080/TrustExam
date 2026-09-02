import React from 'react';

const AdminHeader = ({ onLogout }) => {
  const userStr = localStorage.getItem('user');
  let username = 'Admin';
  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      username = user.username || user.email || 'Admin';
    }
  } catch (e) {
    console.error('Error parsing user:', e);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
              <span className="text-white font-black text-lg tracking-wider">T</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  TrustExam
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">
                  Admin Console
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Proctored Examination Management System</p>
            </div>
          </div>

          {/* User Status & Action */}
          <div className="flex items-center space-x-3">
            
            {/* Live Proctor Status */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Proctor Engine Active</span>
            </div>

            {/* Admin Profile Pill */}
            <div className="flex items-center space-x-2.5 p-1.5 pl-3 pr-3 bg-slate-100/80 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{username}</p>
                <p className="text-[10px] font-semibold text-slate-500 leading-tight">System Admin</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all border border-rose-200/60 flex items-center space-x-1.5 shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;