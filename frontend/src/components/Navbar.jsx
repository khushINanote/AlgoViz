import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                        <Code2 size={28} />
                        <span className="font-bold text-xl tracking-tight">AlgoViz</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden sm:flex items-center space-x-4">
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
                                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600 font-medium transition-colors">
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

                    {/* Mobile: Theme toggle + Hamburger */}
                    <div className="flex items-center gap-2 sm:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="sm:hidden bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-4 flex flex-col gap-4">
                    <Link
                        to="/algorithms"
                        onClick={closeMenu}
                        className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium tracking-wide py-1"
                    >
                        Explore
                    </Link>
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                                className="flex items-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-1"
                            >
                                <LayoutDashboard size={18} className="mr-2" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-red-500 hover:text-red-600 font-medium py-1 transition-colors"
                            >
                                <LogOut size={18} className="mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-1"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                onClick={closeMenu}
                                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all text-center"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
