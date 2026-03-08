import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle } from 'lucide-react';

const questions = [
    {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        template: `function twoSum(nums, target) {\n  // Write your code here\n\n}`,
    }
];

const InterviewMode = () => {
    const [activeQ, setActiveQ] = useState(questions[0]);
    const [code, setCode] = useState(activeQ.template);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (timeLeft > 0 && status === 'idle') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, status]);

    const handleSubmit = () => {
        setStatus('evaluating');
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Interview Mode</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Simulate a real coding interview environment.</p>
                </div>
                <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-lg font-mono font-bold text-xl border border-indigo-200 dark:border-indigo-800/50">
                    <Timer size={24} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow overflow-hidden">
                {/* Question Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{activeQ.title}</h2>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {activeQ.difficulty}
                        </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{activeQ.description}</p>

                    {status === 'success' && (
                        <div className="mt-auto bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg flex items-start space-x-3">
                            <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-emerald-800 dark:text-emerald-400">All Test Cases Passed!</h4>
                                <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">Excellent job solving this in {formatTime(1800 - timeLeft)}!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Code Panel */}
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-700 flex flex-col">
                    <div className="bg-slate-800 px-4 py-3 flex justify-between items-center border-b border-slate-700">
                        <span className="text-sm font-mono text-slate-300">solution.js</span>
                        <button
                            onClick={handleSubmit}
                            disabled={status !== 'idle'}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition disabled:opacity-50"
                        >
                            {status === 'evaluating' ? 'Running...' : 'Submit'}
                        </button>
                    </div>
                    <textarea
                        className="flex-grow w-full bg-slate-900 text-slate-300 p-4 font-mono text-sm outline-none resize-none focus:ring-inset focus:ring-1 focus:ring-indigo-500/50"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );
};

export default InterviewMode;
