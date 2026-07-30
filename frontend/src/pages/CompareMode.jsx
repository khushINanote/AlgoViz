import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, BarChart2 } from 'lucide-react';
import ArrayBar from '../components/ArrayBar';
import {
    bubbleSortAnimations,
    selectionSortAnimations,
    insertionSortAnimations,
    mergeSortAnimations,
    quickSortAnimations
} from '../utils/sortingAlgorithms';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const arrayPatterns = ['Random', 'Sorted', 'Reversed', 'Nearly Sorted'];

const getSortFunc = (id) => {
    switch (id) {
        case 'bubble-sort': return bubbleSortAnimations;
        case 'selection-sort': return selectionSortAnimations;
        case 'insertion-sort': return insertionSortAnimations;
        case 'merge-sort': return mergeSortAnimations;
        case 'quick-sort': return quickSortAnimations;
        default: return bubbleSortAnimations;
    }
}

const DualVisualizer = () => {
    const [algo1, setAlgo1] = useState('selection-sort');
    const [algo2, setAlgo2] = useState('insertion-sort');
    const [arrayPattern, setArrayPattern] = useState('Random');
    const [arraySize, setArraySize] = useState(40);
    const [speed, setSpeed] = useState(80);

    const [baseArray, setBaseArray] = useState([]);

    const [arr1, setArr1] = useState([]);
    const [col1, setCol1] = useState([]);
    const [isPlaying1, setIsPlaying1] = useState(false);

    const [arr2, setArr2] = useState([]);
    const [col2, setCol2] = useState([]);
    const [isPlaying2, setIsPlaying2] = useState(false);

    const [runStats, setRunStats] = useState({ algo1Time: null, algo2Time: null });
    const [liveStats1, setLiveStats1] = useState({ comparisons: 0, swaps: 0 });
    const [liveStats2, setLiveStats2] = useState({ comparisons: 0, swaps: 0 });

    const timersRef1 = useRef([]);
    const timersRef2 = useRef([]);

    useEffect(() => {
        generateNewArray(arraySize, arrayPattern);
        return () => {
            clearAllTimers(timersRef1);
            clearAllTimers(timersRef2);
        };
    }, [arraySize, arrayPattern]);

    const clearAllTimers = (ref) => {
        ref.current.forEach(clearTimeout);
        ref.current = [];
    };

    const generateNewArray = (size, pattern) => {
        clearAllTimers(timersRef1);
        clearAllTimers(timersRef2);
        setIsPlaying1(false);
        setIsPlaying2(false);
        setRunStats({ algo1Time: null, algo2Time: null });
        setLiveStats1({ comparisons: 0, swaps: 0 });
        setLiveStats2({ comparisons: 0, swaps: 0 });

        let newArr = [];
        if (pattern === 'Random') {
            newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
        } else if (pattern === 'Sorted') {
            newArr = Array.from({ length: size }, (_, i) => 10 + Math.floor((i / size) * 90));
        } else if (pattern === 'Reversed') {
            newArr = Array.from({ length: size }, (_, i) => 100 - Math.floor((i / size) * 90));
        } else if (pattern === 'Nearly Sorted') {
            newArr = Array.from({ length: size }, (_, i) => 10 + Math.floor((i / size) * 90));
            for (let i = 0; i < size / 10; i++) {
                const idx1 = Math.floor(Math.random() * size);
                const idx2 = Math.floor(Math.random() * size);
                const temp = newArr[idx1];
                newArr[idx1] = newArr[idx2];
                newArr[idx2] = temp;
            }
        }

        setBaseArray([...newArr]);
        setArr1([...newArr]);
        setArr2([...newArr]);
        setCol1(Array(size).fill('default'));
        setCol2(Array(size).fill('default'));
    };

    const runSortingAlgorithm = (id, setArrayFunc, setColorFunc, setIsPlayingFunc, timersRef, side, setLiveStatsFunc) => {
        setIsPlayingFunc(true);
        const startTime = performance.now();

        const animations = getSortFunc(id)([...baseArray]);

        const maxSpeedMs = 500;
        const minSpeedMs = 5;
        const currentSpeedMs = maxSpeedMs - ((speed / 100) * (maxSpeedMs - minSpeedMs));

        animations.forEach((anim, idx) => {
            const timer = setTimeout(() => {
                if (anim.type === 'compare') {
                    setLiveStatsFunc(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
                    setColorFunc(prev => {
                        const nextColors = [...prev];
                        nextColors[anim.indices[0]] = 'comparing';
                        nextColors[anim.indices[1]] = 'comparing';
                        return nextColors;
                    });
                } else if (anim.type === 'revert') {
                    setColorFunc(prev => {
                        const nextColors = [...prev];
                        nextColors[anim.indices[0]] = 'default';
                        nextColors[anim.indices[1]] = 'default';
                        return nextColors;
                    });
                } else if (anim.type === 'swap' || anim.type === 'overwrite') {
                    setLiveStatsFunc(prev => ({ ...prev, swaps: prev.swaps + 1 }));
                    if (anim.type === 'swap') {
                        setColorFunc(prev => {
                            const nextColors = [...prev];
                            nextColors[anim.indices[0]] = 'swapping';
                            nextColors[anim.indices[1]] = 'swapping';
                            return nextColors;
                        });
                        setArrayFunc(prev => {
                            const nextArr = [...prev];
                            nextArr[anim.indices[0]] = anim.values[0];
                            nextArr[anim.indices[1]] = anim.values[1];
                            return nextArr;
                        });
                    } else {
                        // Overwrite
                        setColorFunc(prev => {
                            const nextColors = [...prev];
                            nextColors[anim.index] = 'swapping';
                            return nextColors;
                        });
                        setArrayFunc(prev => {
                            const nextArr = [...prev];
                            nextArr[anim.index] = anim.value;
                            return nextArr;
                        });
                        setTimeout(() => {
                            setColorFunc(prev => {
                                const nextColors = [...prev];
                                if (nextColors[anim.index] === 'swapping') nextColors[anim.index] = 'default';
                                return nextColors;
                            });
                        }, currentSpeedMs);
                    }
                }

                if (idx === animations.length - 1) {
                    setIsPlayingFunc(false);
                    setColorFunc(Array(arraySize).fill('sorted'));
                    const timeTaken = (performance.now() - startTime).toFixed(2);
                    setRunStats(prev => ({
                        ...prev,
                        [side === 1 ? 'algo1Time' : 'algo2Time']: timeTaken
                    }));
                }
            }, idx * currentSpeedMs);

            timersRef.current.push(timer);
        });
    };

    const handleRunBoth = () => {
        // Reset to base array first before running
        setArr1([...baseArray]);
        setArr2([...baseArray]);
        setCol1(Array(arraySize).fill('default'));
        setCol2(Array(arraySize).fill('default'));

        clearAllTimers(timersRef1);
        clearAllTimers(timersRef2);

        setRunStats({ algo1Time: null, algo2Time: null });

        // Slight delay to allow state changes to register before firing sorts
        setTimeout(() => {
            runSortingAlgorithm(algo1, setArr1, setCol1, setIsPlaying1, timersRef1, 1, setLiveStats1);
            runSortingAlgorithm(algo2, setArr2, setCol2, setIsPlaying2, timersRef2, 2, setLiveStats2);
        }, 100);
    };

    const handleReset = () => {
        generateNewArray(arraySize, arrayPattern);
    }

    const selectOptions = [
        { val: 'bubble-sort', label: 'Bubble Sort' },
        { val: 'selection-sort', label: 'Selection Sort' },
        { val: 'insertion-sort', label: 'Insertion Sort' },
        { val: 'merge-sort', label: 'Merge Sort' },
        { val: 'quick-sort', label: 'Quick Sort' },
    ];

    const isGlobalPlaying = isPlaying1 || isPlaying2;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-primary-text dark:text-secondary-bg flex items-center">
                    <BarChart2 className="mr-2 text-primary-accent" /> Algorithm Race
                </h1>
                <p className="text-sm text-secondary-text dark:text-secondary-text mt-1">Visualize and compare two algorithms side-by-side on the exact same dataset.</p>
            </div>

            {/* Global Controls */}
            <div className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm border border-border dark:border-border p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                    <div>
                        <label className="text-xs text-secondary-text block mb-1">Data Pattern</label>
                        <select
                            disabled={isGlobalPlaying}
                            value={arrayPattern}
                            onChange={(e) => setArrayPattern(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-border dark:border-border bg-primary-bg dark:bg-sidebar text-sm outline-none"
                        >
                            {arrayPatterns.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-secondary-text block mb-1">Array Size ({arraySize})</label>
                        <input
                            type="range" min="10" max="100"
                            value={arraySize}
                            disabled={isGlobalPlaying}
                            onChange={e => setArraySize(parseInt(e.target.value))}
                            className="accent-indigo-500 w-32"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-secondary-text block mb-1">Animation Speed</label>
                        <input
                            type="range" min="1" max="100"
                            value={speed}
                            onChange={e => setSpeed(parseInt(e.target.value))}
                            className="accent-indigo-500 w-32"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleRunBoth}
                        disabled={isGlobalPlaying}
                        className="flex items-center space-x-2 bg-primary-accent hover:bg-primary-accent text-secondary-bg px-6 py-2 rounded-xl font-medium transition disabled:opacity-50"
                    >
                        <Play size={18} /> <span>Start Race</span>
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2 border border-border dark:border-border rounded-xl text-secondary-text hover:bg-primary-bg dark:text-secondary-text dark:hover:bg-slate-700 transition"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Duel Arena */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Algo 1 Panel */}
                <div className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm border border-border dark:border-border flex flex-col p-4 relative overflow-hidden h-full min-h-[300px]">
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-10 items-center">
                        <select
                            value={algo1}
                            onChange={e => setAlgo1(e.target.value)}
                            disabled={isGlobalPlaying}
                            className="px-3 py-1.5 font-bold rounded-xl border border-border dark:border-border bg-secondary-bg dark:bg-sidebar text-primary-text dark:text-secondary-bg outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {selectOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                        </select>
                        {runStats.algo1Time && (
                            <div className="flex gap-2">
                                <span className={`font-mono text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border ${parseFloat(runStats.algo1Time) <= parseFloat(runStats.algo2Time || Infinity)
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : 'bg-primary-bg text-primary-text border-border'
                                    }`}>
                                    {runStats.algo1Time} ms {parseFloat(runStats.algo1Time) <= parseFloat(runStats.algo2Time || Infinity) && '🏆'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="absolute top-16 left-4 flex gap-4 text-[10px] font-mono text-secondary-text z-10 bg-secondary-bg/80 dark:bg-sidebar/80 px-2 py-1 rounded shadow-sm">
                        <span>C: {liveStats1.comparisons}</span>
                        <span>S: {liveStats1.swaps}</span>
                    </div>
                    <div className="flex-grow flex items-end justify-center w-full px-2 pb-2 gap-[1px] mt-16 border-b border-border dark:border-border">
                        {arr1.map((val, idx) => (
                            <ArrayBar
                                key={idx}
                                value={val}
                                maxValue={100}
                                state={col1[idx]}
                                width={max(2, 100 / arraySize)}
                            />
                        ))}
                    </div>
                </div>

                {/* Algo 2 Panel */}
                <div className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm border border-border dark:border-border flex flex-col p-4 relative overflow-hidden h-full min-h-[300px]">
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-10 items-center">
                        <select
                            value={algo2}
                            onChange={e => setAlgo2(e.target.value)}
                            disabled={isGlobalPlaying}
                            className="px-3 py-1.5 font-bold rounded-xl border border-border dark:border-border bg-secondary-bg dark:bg-sidebar text-primary-text dark:text-secondary-bg outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {selectOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                        </select>
                        {runStats.algo2Time && (
                            <div className="flex gap-2">
                                <span className={`font-mono text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border ${parseFloat(runStats.algo2Time) < parseFloat(runStats.algo1Time || Infinity)
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : 'bg-primary-bg text-primary-text border-border'
                                    }`}>
                                    {runStats.algo2Time} ms {parseFloat(runStats.algo2Time) < parseFloat(runStats.algo1Time || Infinity) && '🏆'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="absolute top-16 left-4 flex gap-4 text-[10px] font-mono text-secondary-text z-10 bg-secondary-bg/80 dark:bg-sidebar/80 px-2 py-1 rounded shadow-sm">
                        <span>C: {liveStats2.comparisons}</span>
                        <span>S: {liveStats2.swaps}</span>
                    </div>
                    <div className="flex-grow flex items-end justify-center w-full px-2 pb-2 gap-[1px] mt-16 border-b border-border dark:border-border">
                        {arr2.map((val, idx) => (
                            <ArrayBar
                                key={`arr2_${idx}`}
                                value={val}
                                maxValue={100}
                                state={col2[idx]}
                                width={max(2, 100 / arraySize)}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Performance Comparison Chart */}
            {runStats.algo1Time && runStats.algo2Time && (
                <div className="mt-8 bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm border border-border dark:border-border p-6 flex-shrink-0">
                    <h3 className="text-lg font-bold text-primary-text dark:white mb-6">Performance Comparison</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: selectOptions.find(o => o.val === algo1)?.label, time: parseFloat(runStats.algo1Time), color: '#6366f1' },
                                    { name: selectOptions.find(o => o.val === algo2)?.label, time: parseFloat(runStats.algo2Time), color: '#10b981' }
                                ]}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-sidebar border border-border p-2 rounded shadow-xl text-xs">
                                                    <p className="font-bold text-secondary-bg">{payload[0].payload.name}</p>
                                                    <p className="text-primary-accent">{payload[0].value} ms</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={40}>
                                    {
                                        [0, 1].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#10b981'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Algorithm Picking Guide */}
            <div className="mt-8 bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm border border-border dark:border-border p-6 flex-shrink-0">
                <h3 className="text-lg font-bold text-primary-text dark:text-secondary-bg mb-4">When to use which algorithm?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {[algo1, algo2].includes('quick-sort') && (
                        <div className="bg-primary-bg dark:bg-sidebar rounded-xl p-4 border border-border dark:border-border">
                            <h4 className="font-semibold text-primary-accent dark:text-primary-accent mb-1">Quick Sort</h4>
                            <p className="text-sm text-secondary-text dark:text-secondary-text">Best general-purpose sort. Highly cache efficient. Use it for most random data arrays.</p>
                        </div>
                    )}

                    {[algo1, algo2].includes('merge-sort') && (
                        <div className="bg-primary-bg dark:bg-sidebar rounded-xl p-4 border border-border dark:border-border">
                            <h4 className="font-semibold text-primary-accent dark:text-primary-accent mb-1">Merge Sort</h4>
                            <p className="text-sm text-secondary-text dark:text-secondary-text">Guaranteed O(N log N) time and stable sorting. Use when stability is required or data is large/linked.</p>
                        </div>
                    )}

                    {[algo1, algo2].includes('insertion-sort') && (
                        <div className="bg-primary-bg dark:bg-sidebar rounded-xl p-4 border border-border dark:border-border">
                            <h4 className="font-semibold text-primary-accent dark:text-primary-accent mb-1">Insertion Sort</h4>
                            <p className="text-sm text-secondary-text dark:text-secondary-text">Extremely fast for small datasets or <b>Nearly Sorted</b> data patterns.</p>
                        </div>
                    )}

                    {([algo1, algo2].includes('bubble-sort') || [algo1, algo2].includes('selection-sort')) && (
                        <div className="bg-primary-bg dark:bg-sidebar rounded-xl p-4 border border-border dark:border-border">
                            <h4 className="font-semibold text-primary-accent dark:text-primary-accent mb-1">Bubble / Selection</h4>
                            <p className="text-sm text-secondary-text dark:text-secondary-text">Mostly for educational purposes. Inefficient O(N²) for large arrays, avoid in real projects.</p>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );

    function max(a, b) { return a > b ? a : b; }
};

export default DualVisualizer;
