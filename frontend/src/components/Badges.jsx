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
            color: 'text-warning',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            id: 'fast-learner',
            name: 'Sprinter',
            desc: 'Spent over 5 mins learning',
            icon: <Zap size={20} />,
            earned: (progress?.totalTimeSpent || 0) > 300,
            color: 'text-primary-accent',
            bg: 'bg-primary-accent dark:bg-primary-accent/20'
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
        <div className="bg-secondary-bg dark:bg-sidebar p-8 rounded-xl shadow-sm border border-border dark:border-border">
            <h2 className="text-xl font-bold text-primary-text dark:text-secondary-bg mb-6">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map(badge => (
                    <div
                        key={badge.id}
                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${badge.earned
                                ? `${badge.bg} border-transparent scale-100`
                                : 'bg-primary-bg dark:bg-sidebar/50 border-border dark:border-border grayscale opacity-40'
                            }`}
                    >
                        <div className={`p-3 rounded-full bg-secondary-bg dark:bg-sidebar shadow-sm mb-3 ${badge.color}`}>
                            {badge.icon}
                        </div>
                        <h4 className="text-xs font-bold text-primary-text dark:text-secondary-bg text-center mb-1">{badge.name}</h4>
                        <p className="text-[10px] text-secondary-text dark:text-secondary-text text-center leading-tight">{badge.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Badges;
