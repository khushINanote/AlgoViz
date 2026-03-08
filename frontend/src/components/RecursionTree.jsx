import React from 'react';

const RecursionTree = ({ history, currentStep }) => {
    // Compute the current recursion stack
    const activeCalls = [];

    for (let i = 0; i <= currentStep; i++) {
        const step = history[i];
        if (step.type === 'call') {
            activeCalls.push({ range: step.range, depth: step.stats.depth, id: i });
        } else if (step.type === 'return') {
            activeCalls.pop();
        }
    }

    if (activeCalls.length === 0) return null;

    const totalSize = activeCalls[0]?.range[1] - activeCalls[0]?.range[0] + 1 || 1;

    return (
        <div className="mt-4 p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Recursion Stack</h4>
                <span className="text-[10px] font-mono text-indigo-500 font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                    Depth: {activeCalls.length - 1}
                </span>
            </div>
            <div className="space-y-4">
                {activeCalls.map((call, i) => {
                    const rangeSize = call.range[1] - call.range[0] + 1;
                    const widthPercent = (rangeSize / totalSize) * 100;
                    const leftOffset = (call.range[0] / totalSize) * 100;

                    return (
                        <div key={call.id} className="relative">
                            <div className="flex justify-between items-center mb-1 text-[9px] font-mono text-slate-500">
                                <span>Level {call.depth}</span>
                                <span>[{call.range[0]}, {call.range[1]}]</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div
                                    className={`h-full transition-all duration-300 ${i === activeCalls.length - 1
                                            ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                                            : 'bg-slate-400 dark:bg-slate-500 opacity-50'
                                        }`}
                                    style={{
                                        width: `${widthPercent}%`,
                                        marginLeft: `${leftOffset}%`
                                    }}
                                ></div>
                            </div>
                            {i < activeCalls.length - 1 && (
                                <div className="absolute -bottom-3 left-1/2 w-px h-2 bg-slate-300 dark:bg-slate-700"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[9px] text-slate-400 italic leading-tight">
                    Each bar represents a sub-array being processed in the current recursive call.
                </p>
            </div>
        </div>
    );
};

export default RecursionTree;
