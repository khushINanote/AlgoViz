import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, ArrowLeft } from 'lucide-react';
import ControlPanel from '../components/ControlPanel';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const dsDataObj = {
    'linked-list': {
        name: 'Singly Linked List',
        category: 'data-structures',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'A linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next.'
    },
    'reverse-linked-list': {
        name: 'Reverse Singly Linked List',
        category: 'data-structures',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Reverses the direction of pointers in a singly linked list in-place.'
    },
    'doubly-linked-list': {
        name: 'Doubly Linked List',
        category: 'data-structures',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'A linked list consisting of a set of sequentially linked records called nodes. Each node contains two fields, called links, that point to the previous and to the next node in the sequence.'
    },
    'reverse-doubly-linked-list': {
        name: 'Reverse Doubly Linked List',
        category: 'data-structures',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Swaps the next and prev pointers of every node in a doubly linked list.'
    },
    'stack': {
        name: 'Stack (LIFO)',
        category: 'data-structures',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(N)',
        description: 'A collection of elements with two principal operations: push, which adds an element, and pop, which removes the most recently added element.'
    },
    'queue': {
        name: 'Queue (FIFO)',
        category: 'data-structures',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(N)',
        description: 'A collection of entities that are maintained in a sequence and can be modified by the addition of entities at one end and removal from the other.'
    }
};

const DataStructureView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const dsData = dsDataObj[id];

    const [elements, setElements] = useState([]);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [currentOperation, setCurrentOperation] = useState("");
    const [speed, setSpeed] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);

    // Custom states for rendering logic per DS
    const [pointerStates, setPointerStates] = useState({}); // used for link lists to animate arrows

    const timersRef = useRef([]);

    useEffect(() => {
        if (!dsData) {
            navigate('/algorithms');
        } else {
            generateData();
        }
        return () => clearAllTimers();
    }, [id, navigate]);

    const clearAllTimers = () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    };

    const generateData = () => {
        clearAllTimers();
        setIsPlaying(false);
        setIsFinished(false);
        setActiveIdx(-1);
        setCurrentOperation("");
        setPointerStates({});

        // Default starting states based on ID
        if (id.includes('reverse')) {
            // prefill for reversal algorithms
            setElements([15, 22, 36, 48, 55, 61]);
        } else if (id === 'stack' || id === 'queue') {
            // empty start for linear inserts
            setElements([]);
        } else {
            // static view for normal lists
            setElements([12, 99, 37, 45, 8]);
        }
    };

    const saveProgress = async () => {
        if (!user || !startTime) return;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        try {
            await api.post('/progress/update', { algorithm: id, timeSpent });
        } catch (e) {
            console.error(e);
        }
    };

    // Generic animation mapper since DS are visually varied
    const runAnimationSequence = () => {
        if (isFinished) return;
        setIsPlaying(true);
        setStartTime(Date.now());

        const maxSpeedMs = 1500;
        const minSpeedMs = 200;
        const currentSpeedMs = maxSpeedMs - ((speed / 100) * (maxSpeedMs - minSpeedMs));

        let stepCount = 0;

        if (id === 'linked-list' || id === 'doubly-linked-list') {
            // Just a linear traversal
            const arr = [12, 99, 37, 45, 8];
            arr.forEach((val, idx) => {
                const timer = setTimeout(() => {
                    setActiveIdx(idx);
                    if (idx === arr.length - 1) finishRun();
                }, idx * currentSpeedMs);
                timersRef.current.push(timer);
            });
        }
        else if (id === 'reverse-linked-list' || id === 'reverse-doubly-linked-list') {
            // Animate pointer direction swaps
            const arr = [15, 22, 36, 48, 55, 61];
            let pStates = {};
            arr.forEach((_, idx) => pStates[idx] = 'forward');
            setPointerStates(pStates);

            arr.forEach((_, idx) => {
                const timer = setTimeout(() => {
                    setActiveIdx(idx);
                    setCurrentOperation(`Reversing pointer at Node ${idx}`);
                    setPointerStates(prev => ({ ...prev, [idx - 1]: 'backward' }));
                    if (idx === arr.length - 1) {
                        const finalTimer = setTimeout(() => {
                            setElements([...arr].reverse());
                            setPointerStates({});
                            setCurrentOperation("List Reversed!");
                            finishRun();
                        }, currentSpeedMs * 1.5);
                        timersRef.current.push(finalTimer);
                    }
                }, idx * currentSpeedMs);
                timersRef.current.push(timer);
            });
        }
        else if (id === 'stack') {
            // Push 5 items, pop 2
            const ops = [
                { type: 'push', val: 10 }, { type: 'push', val: 25 }, { type: 'push', val: 33 },
                { type: 'push', val: 41 }, { type: 'push', val: 59 },
                { type: 'pop' }, { type: 'pop' }
            ];

            let count = 0;
            ops.forEach((op, idx) => {
                const timer = setTimeout(() => {
                    if (op.type === 'push') {
                        setCurrentOperation(`Operation: PUSH ${op.val}`);
                        setElements(prev => [...prev, op.val]);
                        setActiveIdx(count);
                        count++;
                    } else {
                        setCurrentOperation(`Operation: POP`);
                        setElements(prev => prev.slice(0, prev.length - 1));
                        count--;
                        setActiveIdx(count - 1);
                    }
                    if (idx === ops.length - 1) finishRun();
                }, idx * currentSpeedMs);
                timersRef.current.push(timer);
            });
        }
        else if (id === 'queue') {
            // Enq 5, deq 2
            const ops = [
                { type: 'enq', val: 10 }, { type: 'enq', val: 25 }, { type: 'enq', val: 33 },
                { type: 'enq', val: 41 }, { type: 'enq', val: 59 },
                { type: 'deq' }, { type: 'deq' }
            ];

            let qCount = 0;
            ops.forEach((op, idx) => {
                const timer = setTimeout(() => {
                    if (op.type === 'enq') {
                        setCurrentOperation(`Operation: ENQUEUE ${op.val}`);
                        setElements(prev => [...prev, op.val]);
                        setActiveIdx(qCount);
                        qCount++;
                    } else {
                        setCurrentOperation(`Operation: DEQUEUE`);
                        setElements(prev => prev.slice(1));
                        qCount--;
                        setActiveIdx(0);
                    }
                    if (idx === ops.length - 1) finishRun();
                }, idx * currentSpeedMs);
                timersRef.current.push(timer);
            });
        }
    };

    const finishRun = () => {
        setIsPlaying(false);
        setIsFinished(true);
        setActiveIdx(-1);
        saveProgress();
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            clearAllTimers();
            setIsPlaying(false);
        } else {
            runAnimationSequence();
        }
    };

    const renderVisualizer = () => {
        if (id.includes('linked-list')) {
            return (
                <div className="flex items-center overflow-x-auto p-8 py-20 min-h-[300px] w-full hide-scrollbar">
                    <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <span className="font-mono text-sm font-bold text-slate-500 mr-4">HEAD</span>
                        {elements.map((val, idx) => {
                            let label = "";
                            if (id.includes('reverse') && activeIdx !== -1) {
                                if (idx === activeIdx - 1) label = "Prev";
                                if (idx === activeIdx) label = "Curr";
                                if (idx === activeIdx + 1) label = "Next";
                            }

                            return (
                                <React.Fragment key={idx}>
                                    {/* The Node */}
                                    <div className={`relative flex flex-col items-center justify-center min-w-[70px] min-h-[70px] border-2 rounded-xl text-lg font-bold transition-all duration-300 ${activeIdx === idx ? 'bg-indigo-500 border-indigo-600 text-white scale-110 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600'}`}>
                                        {label && (
                                            <div className="absolute -top-10 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-[10px] px-2 py-0.5 rounded font-bold shadow-sm border border-indigo-200 dark:border-indigo-700 whitespace-nowrap transform -translate-y-1">
                                                {label}
                                            </div>
                                        )}
                                        {val}
                                        <span className="absolute -bottom-6 text-xs text-slate-400 font-mono">Node {idx}</span>
                                    </div>

                                    {/* The Pointing Arrow between nodes */}
                                    {idx < elements.length - 1 && (
                                        <div className="flex-grow min-w-[30px] flex flex-col justify-center items-center relative text-slate-400">
                                            {id.includes('doubly') ? (
                                                <div className="flex flex-col gap-1 w-full">
                                                    {/* Top arrow right */}
                                                    <div className={`flex w-full items-center transition-all ${pointerStates[idx] === 'backward' ? 'opacity-20' : 'opacity-100 text-indigo-500'}`}>
                                                        <div className="h-0.5 bg-current w-full"></div>
                                                        <ArrowRight size={16} className="-ml-1" />
                                                    </div>
                                                    {/* Bottom arrow left */}
                                                    <div className={`flex w-full items-center transition-all ${pointerStates[idx] === 'backward' ? 'opacity-100 text-emerald-500' : 'opacity-20'}`}>
                                                        <ArrowLeft size={16} className="-mr-1" />
                                                        <div className="h-0.5 bg-current w-full"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex w-full items-center">
                                                    {pointerStates[idx] === 'backward' ? (
                                                        <>
                                                            <ArrowLeft size={20} className="text-emerald-500 -mr-1 transition-all" />
                                                            <div className="h-0.5 bg-emerald-500 w-full transition-all"></div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-0.5 bg-indigo-500 w-full transition-all"></div>
                                                            <ArrowRight size={20} className="text-indigo-500 -ml-1 transition-all" />
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        <span className="font-mono text-sm font-bold text-slate-500 ml-4">NULL</span>
                    </div>
                </div>
            );
        }

        if (id === 'stack') {
            return (
                <div className="flex items-end justify-center h-full p-8 py-20 min-h-[300px] w-full">
                    <div className="flex flex-col-reverse w-48 border-x-4 border-b-4 border-slate-400 dark:border-slate-600 rounded-b-xl overflow-visible p-2 gap-2 bg-slate-50/50 dark:bg-slate-800/20">
                        {elements.map((val, idx) => (
                            <div key={idx} className={`w-full py-4 text-center rounded-lg font-bold text-lg border transition-all ${activeIdx === idx ? 'bg-indigo-500 border-indigo-600 text-white animate-bounce shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-500'}`}>
                                {val}
                            </div>
                        ))}
                    </div>
                    <div className="h-64 flex flex-col justify-end ml-4 text-slate-400 font-mono text-sm font-bold">
                        <span className="mb-2 uppercase tracking-widest text-[10px]">Top</span>
                        <span className="mt-auto uppercase tracking-widest text-[10px]">Bottom</span>
                    </div>
                </div>
            );
        }

        if (id === 'queue') {
            return (
                <div className="flex items-center justify-center overflow-x-auto p-8 py-20 min-h-[300px] w-full">
                    <div className="flex items-center text-slate-400 font-mono text-sm font-bold mr-4 flex-col shrink-0">
                        <span>Dequeue (Front)</span>
                        <ArrowLeft size={20} className="mt-1" />
                    </div>

                    <div className="flex border-y-4 border-slate-400 dark:border-slate-600 h-28 items-center p-2 gap-2 bg-slate-50/50 dark:bg-slate-800/20 min-w-[200px]">
                        {elements.map((val, idx) => (
                            <div key={idx} className={`w-20 h-20 shrink-0 flex items-center justify-center rounded-lg font-bold text-lg border transition-all ${activeIdx === idx ? 'bg-indigo-500 border-indigo-600 text-white shadow-lg scale-110' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-500'}`}>
                                {val}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center text-slate-400 font-mono text-sm font-bold ml-4 flex-col shrink-0">
                        <span>Enqueue (Rear)</span>
                        <ArrowLeft size={20} className="mt-1" />
                    </div>
                </div>
            );
        }
    }

    if (!dsData) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-[calc(100vh-140px)]">
            {/* Header duplicated logic from AlgoView for consistency */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                        <Layers className="mr-3 text-indigo-500" /> {dsData.name}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{dsData.category}</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span className="block text-xs text-slate-500">Time</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{dsData.timeComplexity}</span>
                    </div>
                    <div className="text-center px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span className="block text-xs text-slate-500">Space</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{dsData.spaceComplexity}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
                {/* Description Panel */}
                <div className="lg:col-span-1 flex flex-col gap-4">

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex-grow min-h-[200px]">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Description & Behavior</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            {dsData.description}
                        </p>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                            {id.includes('reverse') && <li>Simulates in-place memory pointer reassignment</li>}
                            {id === 'stack' && <li>Simulates typical call-stack operations</li>}
                            {id === 'queue' && <li>Simulates typical event-loop buffers</li>}
                        </ul>
                    </div>
                </div>

                {/* Visualization Panel */}
                <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex-grow relative overflow-hidden flex flex-col pt-10">
                        {currentOperation && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/90 dark:text-indigo-200 px-6 py-1.5 rounded-full font-bold shadow-sm border border-indigo-200 dark:border-indigo-700 whitespace-nowrap transform transition-all text-sm">
                                {currentOperation}
                            </div>
                        )}
                        {renderVisualizer()}
                    </div>
                    <ControlPanel
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onReset={generateData}
                        onStep={() => { }} // Stub
                        speed={speed}
                        onSpeedChange={setSpeed}
                        arraySize={elements.length}
                        onArraySizeChange={() => { }}
                        onGenerateRandom={generateData}
                        customList={null}
                        onCustomListChange={(arr) => setElements([...arr])}
                        targetValue={0}
                        onTargetValueChange={() => { }}
                        isSearching={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataStructureView;
