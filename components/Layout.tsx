import React, { PropsWithChildren } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Sparkles, History, Home, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Sparkles size={20} strokeWidth={2.5} className="drop-shadow-sm" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              SolveMate
            </span>
          </Link>
          
          <nav className="flex items-center gap-4">
            {(location.pathname !== '/' && location.pathname !== '/app') && (
               <Link 
               to="/app" 
               className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
               title="Home"
             >
               <Home size={20} />
             </Link>
            )}
            
            {user && (
              <>
                <Link 
                  to="/history" 
                  className={`p-2 rounded-full transition-colors ${location.pathname === '/history' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
                  title="History"
                >
                  <History size={20} />
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600 hidden md:block">{user.email}</span>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Log Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
              </>
            )}

            {!user && location.pathname !== '/login' && (
               <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                 Log In
               </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} SolveMate. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};