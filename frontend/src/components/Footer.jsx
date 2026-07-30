import React from 'react';
import { Code2 } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary-bg dark:bg-sidebar border-t border-border dark:border-border py-8 transition-colors mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                <div className="flex items-center space-x-2 text-primary-accent dark:text-primary-accent mb-4">
                    <Code2 size={24} />
                    <span className="font-bold text-lg tracking-tight">AlgoViz</span>
                </div>
                <p className="text-secondary-text dark:text-secondary-text text-sm">
                    &copy; {new Date().getFullYear()} AlgoViz Platform.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
