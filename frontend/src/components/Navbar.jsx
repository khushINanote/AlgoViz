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
        <nav className="bg-secondary-bg dark:bg-sidebar shadow-sm sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 text-primary-accent dark:text-primary-accent">
                        <Code2 size={28} />
                        <span className="font-bold text-xl tracking-tight">AlgoViz</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        <ThemeToggle />
                        <Link to="/algorithms" className="text-secondary-text dark:text-secondary-text hover:text-primary-accent dark:hover:text-primary-accent font-medium transition-colors">
                            Explore
                        </Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="flex items-center text-secondary-text dark:text-secondary-text hover:text-primary-accent dark:hover:text-primary-accent font-medium">
                                    <LayoutDashboard size={18} className="mr-1.5" />
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="flex items-center text-error hover:text-error font-medium transition-colors">
                                    <LogOut size={18} className="mr-1.5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-secondary-text dark:text-secondary-text hover:text-primary-accent dark:hover:text-primary-accent font-medium">Log in</Link>
                                <Link to="/signup" className="px-5 py-2 rounded-xl bg-primary-accent text-secondary-bg font-medium hover:bg-primary-accent transition-all shadow-md hover:shadow-md transform hover:-translate-y-0.5">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-3 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 -mr-2 text-secondary-text dark:text-secondary-text hover:bg-primary-bg dark:hover:bg-sidebar rounded-xl transition-colors"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-secondary-bg dark:bg-sidebar border-t border-border dark:border-border animate-in slide-in-from-top duration-200">
                    <div className="px-4 py-6 flex flex-col gap-4">
                    <Link
                        to="/algorithms"
                        onClick={closeMenu}
                        className="text-secondary-text dark:text-secondary-text hover:text-primary-accent dark:hover:text-primary-accent font-medium tracking-wide py-1"
                    >
                        Explore
                    </Link>
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                                className="flex items-center text-secondary-text dark:text-secondary-text hover:text-primary-accent dark:hover:text-primary-accent font-medium py-1"
                            >
                                <LayoutDashboard size={18} className="mr-2" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-error hover:text-error font-medium py-1 transition-colors"
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
                                className="text-secondary-text dark:text-secondary-text hover:text-primary-accent dark:hover:text-primary-accent font-medium py-1"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                onClick={closeMenu}
                                className="px-5 py-2 rounded-xl bg-primary-accent text-secondary-bg font-medium hover:bg-primary-accent transition-all text-center"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        )}
        </nav>
    );
};

export default Navbar;
