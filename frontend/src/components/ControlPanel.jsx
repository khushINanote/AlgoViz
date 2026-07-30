import React, { useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

const ControlPanel = ({
    isPlaying,
    onPlayPause,
    onReset,
    onStepForward,
    onStepBack,
    disableStepForward,
    disableStepBack,
    speed,
    onSpeedChange,
    arraySize,
    onArraySizeChange,
    onGenerateRandom,
    customList,
    onCustomListChange,
    targetValue,
    onTargetValueChange,
    isSearching
}) => {
    const customListRef = useRef('');

    const parseAndRun = () => {
        const arr = customListRef.current.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (arr.length > 0) onCustomListChange(arr);
    };

    const handleCustomListApply = (e) => {
        customListRef.current = e.target.value;
        if (e.key === 'Enter') parseAndRun();
    };
    return (
        <div className="bg-secondary-bg dark:bg-sidebar p-4 rounded-xl shadow-sm border border-border dark:border-border mt-4 flex flex-col lg:flex-row items-center justify-between gap-6">

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 w-full lg:w-auto">
                <button
                    onClick={onStepBack}
                    disabled={disableStepBack || isPlaying}
                    className="p-2 sm:p-2.5 bg-primary-bg dark:bg-sidebar text-slate-700 dark:text-secondary-text rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition"
                    title="Previous Step"
                >
                    <SkipBack size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                    onClick={onPlayPause}
                    className="p-3 sm:p-4 bg-primary-accent text-secondary-bg rounded-full hover:bg-primary-accent transition shadow-sm"
                >
                    {isPlaying ? <Pause size={20} className="sm:w-[24px] sm:h-[24px]" /> : <Play size={20} className="sm:w-[24px] sm:h-[24px] ml-0.5" />}
                </button>
                <button
                    onClick={onStepForward}
                    disabled={disableStepForward || isPlaying}
                    className="p-2 sm:p-2.5 bg-primary-bg dark:bg-sidebar text-slate-700 dark:text-secondary-text rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition"
                    title="Next Step"
                >
                    <SkipForward size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                    onClick={onReset}
                    className="p-2 sm:p-2.5 bg-primary-bg dark:bg-sidebar text-slate-700 dark:text-secondary-text rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                    <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
                {/* Array Controls */}
                <div className="flex-grow sm:flex-initial sm:w-32">
                    <label className="text-[10px] font-bold text-secondary-text uppercase tracking-tight mb-1 block">Size: {arraySize}</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={arraySize}
                        onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-sidebar rounded-xl appearance-none cursor-pointer accent-indigo-600"
                        disabled={isPlaying}
                    />
                </div>

                {/* Speed Controls */}
                <div className="flex-grow sm:flex-initial sm:w-32">
                    <label className="text-[10px] font-bold text-secondary-text uppercase tracking-tight mb-1 block">Speed: {speed}%</label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={speed}
                        onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-sidebar rounded-xl appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
            </div>

            {/* Custom Inputs Row */}
            <div className="w-full flex flex-col sm:flex-row gap-4 pt-4 border-t border-border dark:border-border/50">
                <div className="flex-grow">
                    <label className="text-xs font-medium text-secondary-text dark:text-secondary-text mb-1 block uppercase tracking-wider">Custom List (comma separated)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. 45, 12, 89, 34"
                            className="flex-1 bg-primary-bg dark:bg-sidebar border border-border dark:border-border rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition tracking-wide text-slate-700 dark:text-primary-text"
                            onChange={(e) => { customListRef.current = e.target.value; }}
                            onKeyDown={handleCustomListApply}
                            disabled={isPlaying}
                        />
                        <button
                            onClick={parseAndRun}
                            disabled={isPlaying}
                            className="px-4 py-1.5 bg-primary-accent text-secondary-bg text-sm font-medium rounded-xl hover:bg-primary-accent transition disabled:opacity-50 whitespace-nowrap"
                        >
                            Run
                        </button>
                    </div>
                </div>
                {isSearching && (
                    <div className="sm:w-32">
                        <label className="text-xs font-medium text-secondary-text dark:text-secondary-text mb-1 block uppercase tracking-wider">Target Value</label>
                        <input
                            type="number"
                            value={targetValue}
                            onChange={(e) => onTargetValueChange(parseInt(e.target.value))}
                            className="w-full bg-primary-bg dark:bg-sidebar border border-border dark:border-border rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-slate-700 dark:text-primary-text"
                            disabled={isPlaying}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ControlPanel;
