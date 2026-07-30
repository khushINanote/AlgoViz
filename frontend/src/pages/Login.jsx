import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.submitter?.setAttribute("disabled", "true");
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            e.submitter?.removeAttribute("disabled");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-primary-bg dark:bg-sidebar px-4 py-12">
            <div className="max-w-md w-full bg-secondary-bg dark:bg-sidebar rounded-xl shadow-xl border border-border dark:border-border p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-accent dark:bg-primary-accent/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn size={28} className="text-primary-accent dark:text-primary-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-text dark:text-secondary-bg">Welcome back</h2>
                    <p className="text-secondary-text dark:text-secondary-text mt-2">Sign in to continue your learning</p>
                </div>

                {error && <div className="bg-red-50 dark:bg-red-900/30 text-error dark:text-error p-3 rounded-xl text-sm mb-6 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-secondary-text mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-border dark:border-border bg-secondary-bg dark:bg-sidebar text-primary-text dark:text-secondary-bg focus:ring-2 focus:ring-indigo-500 focus:border-primary-accent outline-none transition-all"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-secondary-text mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-border dark:border-border bg-secondary-bg dark:bg-sidebar text-primary-text dark:text-secondary-bg focus:ring-2 focus:ring-indigo-500 focus:border-primary-accent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary-accent hover:bg-primary-accent text-secondary-bg font-semibold py-3 rounded-xl transition-colors shadow-md">
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-secondary-text dark:text-secondary-text">
                    Don't have an account? <Link to="/signup" className="text-primary-accent dark:text-primary-accent font-semibold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
