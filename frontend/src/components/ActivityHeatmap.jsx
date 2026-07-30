import React from 'react';

const ActivityHeatmap = ({ activities }) => {
    // Generate an array for the last 53 weeks (371 days) to show a full year
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Start from the beginning of the week 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay); // Align to Sunday

    const days = [];
    const curr = new Date(startDate);
    while (curr <= today || days.length < 371) {
        days.push({
            date: new Date(curr).toISOString().split('T')[0],
            count: 0,
            month: curr.getMonth(),
            dayOfWeek: curr.getDay()
        });
        curr.setDate(curr.getDate() + 1);
    }

    // Populate counts from activityLog
    activities?.forEach(act => {
        try {
            const dateStr = new Date(act.date).toISOString().split('T')[0];
            const day = days.find(d => d.date === dateStr);
            if (day) day.count++;
        } catch (e) {
            console.error("Error parsing date", e);
        }
    });

    const monthLabels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Get indices where months start for labels
    const labels = [];
    days.forEach((day, i) => {
        if (i % 7 === 0) { // Only check start of weeks
            const d = new Date(day.date);
            if (d.getDate() <= 7) {
                labels.push({ index: Math.floor(i / 7), label: monthLabels[d.getMonth()] });
            }
        }
    });

    const getColor = (count) => {
        if (count === 0) return 'bg-primary-bg dark:bg-sidebar';
        if (count <= 2) return 'bg-emerald-200 dark:bg-emerald-900/60';
        if (count <= 4) return 'bg-emerald-400 dark:bg-emerald-700';
        if (count <= 6) return 'bg-emerald-500 dark:bg-emerald-600';
        return 'bg-emerald-700 dark:bg-emerald-400';
    };

    return (
        <div className="mt-8 bg-secondary-bg dark:bg-sidebar p-6 rounded-xl shadow-sm border border-border dark:border-border transition-colors">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary-text dark:text-secondary-bg">
                    {activities?.length || 0} submissions in the last year
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-secondary-text">
                    <span>Total active days:</span>
                    <span className="text-secondary-text dark:text-secondary-text font-bold">
                        {new Set(activities?.map(a => new Date(a.date).toDateString())).size}
                    </span>
                </div>
            </div>

            <div className="flex flex-col">
                {/* Month Labels */}
                <div className="flex ml-8 mb-1 relative h-4">
                    {labels.map((l, i) => (
                        <span
                            key={i}
                            className="absolute text-[9px] text-secondary-text font-medium"
                            style={{ left: `${l.index * 13.5}px` }}
                        >
                            {l.label}
                        </span>
                    ))}
                </div>

                <div className="flex">
                    {/* Day Labels */}
                    <div className="flex flex-col justify-between pr-2 text-[9px] text-secondary-text h-[88px] pt-1">
                        <span className="h-2.5"></span>
                        <span className="h-2.5">Mon</span>
                        <span className="h-2.5"></span>
                        <span className="h-2.5">Wed</span>
                        <span className="h-2.5"></span>
                        <span className="h-2.5">Fri</span>
                        <span className="h-2.5"></span>
                    </div>

                    <div className="flex-grow overflow-x-auto pb-2 scroll-smooth hide-scrollbar">
                        <div className="grid grid-flow-col grid-rows-7 gap-[2px] w-max">
                            {days.map((day, i) => (
                                <div
                                    key={i}
                                    className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-200 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 dark:hover:ring-offset-slate-900 cursor-pointer ${getColor(day.count)}`}
                                    title={`${day.date}: ${day.count} activities`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="text-[10px] text-secondary-text italic">
                    Learn regularly to maintain your streak!
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-secondary-text">
                    <span>Less</span>
                    <div className="w-[10px] h-[10px] rounded-[1px] bg-primary-bg dark:bg-sidebar"></div>
                    <div className="w-[10px] h-[10px] rounded-[1px] bg-emerald-200 dark:bg-emerald-900/60"></div>
                    <div className="w-[10px] h-[10px] rounded-[1px] bg-emerald-400 dark:bg-emerald-700"></div>
                    <div className="w-[10px] h-[10px] rounded-[1px] bg-emerald-500 dark:bg-emerald-600"></div>
                    <div className="w-[10px] h-[10px] rounded-[1px] bg-emerald-700 dark:bg-emerald-400"></div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
