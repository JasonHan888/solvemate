import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    History,
    UserCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface SidebarLayoutProps {
    children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile } = useApp();
    const { signOut } = useAuth();

    // Handle window resize to auto-collapse on mobile
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/app', icon: <LayoutDashboard size={20} />, label: 'Analyze' },
        { path: '/history', icon: <History size={20} />, label: 'History' },
        { path: '/profile', icon: <UserCircle size={20} />, label: 'Profile' },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Mobile Header */}
            {isMobile && (
                <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white">
                            <Sparkles size={16} />
                        </div>
                        <span className="font-bold text-slate-800">SolveMate</span>
                    </div>
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out shadow-sm
          ${isMobile
                        ? (showMobileMenu ? 'translate-x-0 w-64' : '-translate-x-full w-64')
                        : (isExpanded ? 'w-64' : 'w-20')
                    }
          ${isMobile && 'pt-16'} 
        `}
            >
                {/* Desktop Toggle Button */}
                {!isMobile && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-blue-600 shadow-sm z-50"
                    >
                        {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                    </button>
                )}

                {/* Logo Area (Desktop) */}
                {!isMobile && (
                    <div className={`h-16 flex items-center ${isExpanded ? 'px-6' : 'justify-center'} border-b border-slate-100`}>
                        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
                                <Sparkles size={20} strokeWidth={2.5} />
                            </div>
                            <span className={`font-bold text-xl bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                                SolveMate
                            </span>
                        </div>
                    </div>
                )}

                {/* Navigation Items */}
                <nav className="p-4 space-y-2 mt-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => isMobile && setShowMobileMenu(false)}
                                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden whitespace-nowrap
                  ${isActive
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }
                  ${!isExpanded && !isMobile ? 'justify-center' : ''}
                `}
                                title={!isExpanded ? item.label : ''}
                            >
                                <span className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {item.icon}
                                </span>

                                <span className={`transition-all duration-300 ${isExpanded || isMobile ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-14'}`}>
                                    {item.label}
                                </span>

                                {isActive && (isExpanded || isMobile) && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white">
                    <div className={`flex items-center gap-3 ${!isExpanded && !isMobile ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                            {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>

                        {(isExpanded || isMobile) && (
                            <div className="flex-grow overflow-hidden">
                                <p className="text-sm font-medium text-slate-700 truncate">
                                    {profile?.username || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        )}

                        {(isExpanded || isMobile) && (
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Log Out"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>

                    {/* Collapsed Logout Button */}
                    {(!isExpanded && !isMobile) && (
                        <button
                            onClick={handleLogout}
                            className="w-full mt-4 p-2 flex justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`
          flex-grow transition-all duration-300 ease-in-out
          ${isMobile ? 'pt-16' : (isExpanded ? 'ml-64' : 'ml-20')}
        `}
            >
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobile && showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm animate-fade-in"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}
        </div>
    );
};
