import React from 'react';
import { Code2 } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-4">
                    <Code2 size={24} />
                    <span className="font-bold text-lg tracking-tight">AlgoViz</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} AlgoViz Platform.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
