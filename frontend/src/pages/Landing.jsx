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
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
                            Master Algorithms Visually <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Like Never Before</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                            Interactive visualization platform to learn Data Structures and Algorithms. See the code execute step-by-step and master technical interviews.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-lg transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center">
                                Start Learning <ArrowRight className="ml-2" size={20} />
                            </Link>
                            <Link to="/algorithms" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl text-lg transition-all shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                Explore Algorithms
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Background blobs */}
                <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Learn with AlgoViz?</h2>
                        <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">Everything you need to master algorithms</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Code size={32} className="text-indigo-600" />}
                            title="Interactive Execution"
                            description="Watch algorithms run line-by-line. Control speed, pause, and step through execution."
                        />
                        <FeatureCard
                            icon={<Zap size={32} className="text-yellow-500" />}
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
    <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
        <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export default Landing;
