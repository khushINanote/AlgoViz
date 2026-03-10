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
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Playback Controls */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={onStepBack}
                    disabled={disableStepBack || isPlaying}
                    className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition"
                    title="Previous Step"
                >
                    <SkipBack size={18} />
                </button>
                <button
                    onClick={onPlayPause}
                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>
                <button
                    onClick={onStepForward}
                    disabled={disableStepForward || isPlaying}
                    className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition"
                    title="Next Step"
                >
                    <SkipForward size={18} />
                </button>
                <button
                    onClick={onReset}
                    className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto flex-wrap sm:flex-nowrap">
                {/* Array Controls */}
                <div className="flex-1 md:w-28">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Array Size</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={arraySize}
                        onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                        disabled={isPlaying}
                    />
                </div>

                {/* Speed Controls */}
                <div className="flex-1 md:w-28">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Animation Speed</label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={speed}
                        onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                    />
                </div>

                <button
                    onClick={onGenerateRandom}
                    disabled={isPlaying}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition disabled:opacity-50 mt-2 sm:mt-0 whitespace-nowrap"
                >
                    New Array
                </button>
            </div>

            {/* Custom Inputs Row */}
            <div className="w-full flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex-grow">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Custom List (comma separated)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. 45, 12, 89, 34"
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition tracking-wide text-slate-700 dark:text-slate-200"
                            onChange={(e) => { customListRef.current = e.target.value; }}
                            onKeyDown={handleCustomListApply}
                            disabled={isPlaying}
                        />
                        <button
                            onClick={parseAndRun}
                            disabled={isPlaying}
                            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 whitespace-nowrap"
                        >
                            Run
                        </button>
                    </div>
                </div>
                {isSearching && (
                    <div className="sm:w-32">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Target Value</label>
                        <input
                            type="number"
                            value={targetValue}
                            onChange={(e) => onTargetValueChange(parseInt(e.target.value))}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-slate-700 dark:text-slate-200"
                            disabled={isPlaying}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ControlPanel;
