import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Award, Clock, Target, ArrowRight, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import ActivityHeatmap from '../components/ActivityHeatmap';
import Badges from '../components/Badges';

const Dashboard = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await api.get('/progress');
                setProgress(res.data);
            } catch (error) {
                console.error("Error fetching progress", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    if (loading) return <div className="p-8 text-center text-secondary-text">Loading dashboard...</div>;

    const totalAlgorithms = 10; // Temp constant
    const completed = progress?.completedAlgorithms?.length || 0;
    const percentage = Math.round((completed / totalAlgorithms) * 100);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-primary-text dark:text-secondary-bg">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
                <p className="text-secondary-text dark:text-secondary-text mt-2">Here's your learning progress so far.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    icon={<Target size={24} className="text-primary-accent" />}
                    title="Algorithms Completed"
                    value={`${completed} / ${totalAlgorithms}`}
                    subtitle={`${percentage}% of curriculum`}
                />
                <StatCard
                    icon={<Clock size={24} className="text-warning" />}
                    title="Time Spent"
                    value={`${Math.round((progress?.totalTimeSpent || 0) / 60)} mins`}
                    subtitle="Total execution time"
                />
                <StatCard
                    icon={<Award size={24} className="text-emerald-500" />}
                    title="Quiz Score"
                    value={progress?.quizScore || 0}
                    subtitle="Total points earned"
                />
            </div>

            <ActivityHeatmap activities={progress?.activityLog} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm border border-border dark:border-border p-8">
                    <h2 className="text-xl font-bold text-primary-text dark:text-secondary-bg mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {progress?.activityLog?.length > 0 ? (
                            progress.activityLog.slice(-5).reverse().map((act, i) => (
                                <div key={i} className="flex items-center gap-4 text-sm border-b border-border dark:border-border/50 pb-3 last:border-0 last:pb-0">
                                    <div className={`p-2 rounded-xl ${act.type === 'completion' ? 'bg-primary-accent dark:bg-primary-accent/30 text-primary-accent' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600'}`}>
                                        <History size={16} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-primary-text dark:text-primary-text">
                                            {act.type === 'completion' ? `Completed ${act.algorithm}` : `Scored in ${act.algorithm} Quiz`}
                                        </p>
                                        <p className="text-[10px] text-secondary-text">{new Date(act.date).toLocaleDateString()} at {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-secondary-text italic">No recent activity found. Start a new algorithm to see your progress!</p>
                        )}
                    </div>
                </div>

                <div className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm border border-border dark:border-border p-8">
                    <h2 className="text-xl font-bold text-primary-text dark:text-secondary-bg mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ActionCard
                            title="Continue Learning"
                            desc="Pick up where you left off"
                            to="/algorithms"
                            color="bg-primary-accent hover:bg-primary-accent"
                        />
                        <ActionCard
                            title="Interview Mode"
                            desc="Test your skills against the clock"
                            to="/interview"
                            color="bg-sidebar dark:bg-sidebar hover:bg-slate-700 dark:hover:bg-slate-600"
                        />
                        <ActionCard
                            title="Compare Mode"
                            desc="Battle of algorithms"
                            to="/compare"
                            color="bg-secondary-bg dark:bg-sidebar text-primary-text dark:text-secondary-bg border border-border dark:border-border hover:bg-primary-bg dark:hover:bg-sidebar"
                            isOutline={true}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Badges progress={progress} />
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, subtitle }) => (
    <div className="bg-secondary-bg dark:bg-sidebar p-6 rounded-xl shadow-sm border border-border dark:border-border flex items-start space-x-4">
        <div className="p-3 bg-primary-bg dark:bg-sidebar/50 rounded-xl">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-secondary-text dark:text-secondary-text">{title}</p>
            <h3 className="text-2xl font-bold text-primary-text dark:text-secondary-bg mt-1">{value}</h3>
            <p className="text-xs text-secondary-text dark:text-secondary-text mt-1">{subtitle}</p>
        </div>
    </div>
);

const ActionCard = ({ title, desc, to, color, isOutline }) => (
    <Link to={to} className={`p-6 rounded-xl flex flex-col h-full transition-all ${color} ${isOutline ? '' : 'text-secondary-bg'}`}>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className={`text-sm mb-4 flex-grow ${isOutline ? 'text-secondary-text dark:text-secondary-text' : 'text-secondary-bg/80'}`}>{desc}</p>
        <div className="flex items-center text-sm font-semibold mt-auto">
            Start <ArrowRight size={16} className="ml-1" />
        </div>
    </Link>
);

export default Dashboard;
