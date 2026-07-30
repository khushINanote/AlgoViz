import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, BarChart3, CheckCircle2 } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 py-20 lg:py-32 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-text dark:text-secondary-bg tracking-tight leading-tight mb-6 sm:mb-8">
                            Master Algorithms Visually <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Like Never Before</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-secondary-text dark:text-secondary-text mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
                            Interactive visualization platform to learn Data Structures and Algorithms. See the code execute step-by-step and master technical interviews.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary-accent hover:bg-primary-accent text-secondary-bg font-semibold rounded-xl text-lg transition-all shadow-md hover:shadow-indigo-500/30 flex items-center justify-center">
                                Start Learning <ArrowRight className="ml-2" size={20} />
                            </Link>
                            <Link to="/algorithms" className="w-full sm:w-auto px-8 py-4 bg-secondary-bg dark:bg-sidebar text-primary-text dark:text-secondary-bg font-semibold rounded-xl text-lg transition-all shadow-md hover:shadow-md border border-border dark:border-border flex items-center justify-center">
                                Explore Algorithms
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Background blobs */}
                <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary-accent dark:bg-primary-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-secondary-bg dark:bg-sidebar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary-text dark:text-secondary-bg">Why Learn with AlgoViz?</h2>
                        <p className="mt-4 text-lg sm:text-xl text-secondary-text dark:text-secondary-text">Everything you need to master algorithms</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <FeatureCard
                            icon={<Code size={32} className="text-primary-accent" />}
                            title="Interactive Execution"
                            description="Watch algorithms run line-by-line. Control speed, pause, and step through execution."
                        />
                        <FeatureCard
                            icon={<Zap size={32} className="text-warning" />}
                            title="Multiple Categories"
                            description="Learn Sorting, Searching, Graphs, and Data Structures all in one place."
                        />
                        <FeatureCard
                            icon={<BarChart3 size={32} className="text-emerald-500" />}
                            title="Compare Mode"
                            description="Run algorithms side-by-side and see real-time runtime complexity comparisons."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-primary-bg dark:bg-sidebar p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border dark:border-border">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary-bg dark:bg-sidebar rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-primary-text dark:text-secondary-bg mb-3">{title}</h3>
        <p className="text-secondary-text dark:text-secondary-text leading-relaxed">{description}</p>
    </div>
);

export default Landing;
