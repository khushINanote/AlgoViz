import React from 'react';

const ArrayBar = ({ value, maxValue, state, width }) => {
    const heightPercent = (value / maxValue) * 100;

    // States: default, comparing, swapping, sorted
    let colorClass = "bg-indigo-300 dark:bg-indigo-600";
    if (state === 'comparing') colorClass = "bg-yellow-400";
    if (state === 'swapping') colorClass = "bg-red-500";
    if (state === 'sorted') colorClass = "bg-emerald-500";

    return (
        <div
            className="flex flex-col justify-end items-center group relative h-full"
            style={{ width: `${Math.max(2, width)}%` }}
        >
            <div
                className={`w-full rounded-t-sm transition-all duration-200 ${colorClass}`}
                style={{ height: `${heightPercent}%` }}
            ></div>
            {/* Value text rendered strictly below the bar */}
            {width > 3 && (
                <div className="h-6 mt-1 hidden md:flex items-center justify-center shrink-0">
                    <span className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold -rotate-90 md:rotate-0 tracking-tighter w-full text-center">
                        {value}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ArrayBar;
