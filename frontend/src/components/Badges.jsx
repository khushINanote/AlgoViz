import React from 'react';
import { Shield, Zap, Star, Trophy } from 'lucide-react';

const Badges = ({ progress }) => {
    const completedCount = progress?.completedAlgorithms?.length || 0;
    const quizScore = progress?.quizScore || 0;

    const badges = [
        {
            id: 'first-sort',
            name: 'Seedling',
            desc: 'Completed first algorithm',
            icon: <Zap size={20} />,
            earned: completedCount >= 1,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            id: 'fast-learner',
            name: 'Sprinter',
            desc: 'Spent over 5 mins learning',
            icon: <Zap size={20} />,
            earned: (progress?.totalTimeSpent || 0) > 300,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            id: 'quiz-master',
            name: 'Scholar',
            desc: 'Earned 5+ quiz points',
            icon: <Star size={20} />,
            earned: quizScore >= 5,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20'
        },
        {
            id: 'completionist',
            name: 'Algorithm Master',
            desc: 'Complete 5+ algorithms',
            icon: <Trophy size={20} />,
            earned: completedCount >= 5,
            color: 'text-rose-500',
            bg: 'bg-rose-50 dark:bg-rose-900/20'
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map(badge => (
                    <div
                        key={badge.id}
                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${badge.earned
                                ? `${badge.bg} border-transparent scale-100`
                                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 grayscale opacity-40'
                            }`}
                    >
                        <div className={`p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-3 ${badge.color}`}>
                            {badge.icon}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white text-center mb-1">{badge.name}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight">{badge.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Badges;
