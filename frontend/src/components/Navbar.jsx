import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, LogOut, LayoutDashboard, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                        <Code2 size={28} />
                        <span className="font-bold text-xl tracking-tight">AlgoViz</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Link to="/algorithms" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium tracking-wide">
                            Explore
                        </Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="flex items-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                                    <LayoutDashboard size={18} className="mr-1.5" />
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="flex items-center text-red-500 hover:text-red-600 font-medium transition-colors">
                                    <LogOut size={18} className="mr-1.5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Log in</Link>
                                <Link to="/signup" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
