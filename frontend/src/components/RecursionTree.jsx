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
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-[9px] font-bold text-secondary-text uppercase tracking-widest">Recursion Stack</h4>
                <span className="text-[9px] font-mono text-primary-accent font-bold px-1.5 py-0.5 bg-primary-accent/30 rounded-full">
                    Depth: {activeCalls.length - 1}
                </span>
            </div>
            <div className="space-y-3">
                {activeCalls.map((call, i) => {
                    const rangeSize = call.range[1] - call.range[0] + 1;
                    const widthPercent = (rangeSize / totalSize) * 100;
                    const leftOffset = (call.range[0] / totalSize) * 100;

                    return (
                        <div key={call.id} className="relative">
                            <div className="flex justify-between items-center mb-0.5 text-[8px] font-mono text-secondary-text">
                                <span>L{call.depth}</span>
                                <span>[{call.range[0]}, {call.range[1]}]</span>
                            </div>
                            <div className="h-1.5 bg-sidebar rounded-full overflow-hidden border border-border">
                                <div
                                    className={`h-full transition-all duration-300 ${i === activeCalls.length - 1
                                        ? 'bg-primary-accent shadow-[0_0_6px_rgba(99,102,241,0.4)]'
                                        : 'bg-slate-600 opacity-40'
                                        }`}
                                    style={{
                                        width: `${widthPercent}%`,
                                        marginLeft: `${leftOffset}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecursionTree;
