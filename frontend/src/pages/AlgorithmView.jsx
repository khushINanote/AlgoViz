import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrayBar from '../components/ArrayBar';
import ControlPanel from '../components/ControlPanel';
import {
    bubbleSortAnimations,
    selectionSortAnimations,
    insertionSortAnimations,
    mergeSortAnimations,
    quickSortAnimations
} from '../utils/sortingAlgorithms';
import {
    linearSearchAnimations,
    binarySearchAnimations
} from '../utils/searchingAlgorithms';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CheckCircle2, RefreshCcw, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecursionTree from '../components/RecursionTree';

const algorithmsData = {
    'bubble-sort': {
        name: 'Bubble Sort',
        category: 'sorting',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        difficulty: 'Easy',
        description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        practiceProblems: [
            { name: 'Sort Colors', link: 'https://leetcode.com/problems/sort-colors/' },
            { name: 'Move Zeroes', link: 'https://leetcode.com/problems/move-zeroes/' }
        ],
        code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}`
    },
    'selection-sort': {
        name: 'Selection Sort',
        category: 'sorting',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        difficulty: 'Easy',
        description: 'Divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front of the list and a sublist of the remaining unsorted items.',
        practiceProblems: [
            { name: 'Find Target Indices', link: 'https://leetcode.com/problems/find-target-indices-after-sorting-array/' }
        ],
        code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    swap(arr, i, minIdx);
  }
  return arr;
}`
    },
    'insertion-sort': {
        name: 'Insertion Sort',
        category: 'sorting',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        difficulty: 'Easy',
        description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
        practiceProblems: [
            { name: 'Insertion Sort List', link: 'https://leetcode.com/problems/insertion-sort-list/' }
        ],
        code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
    },
    'merge-sort': {
        name: 'Merge Sort',
        category: 'sorting',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        difficulty: 'Intermediate',
        description: 'An efficient, general-purpose, and comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output.',
        practiceProblems: [
            { name: 'Merge Sorted Array', link: 'https://leetcode.com/problems/merge-sorted-array/' },
            { name: 'Sort an Array', link: 'https://leetcode.com/problems/sort-an-array/' }
        ],
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`
    },
    'quick-sort': {
        name: 'Quick Sort',
        category: 'sorting',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        difficulty: 'Intermediate',
        description: 'An efficient, general-purpose sorting algorithm. Quicksort is a divide-and-conquer algorithm. It works by selecting a \'pivot\' element from the array and partitioning the other elements into two sub-arrays.',
        practiceProblems: [
            { name: 'Kth Largest Element', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' }
        ],
        code: `function quickSort(arr, left, right) {
  if (left < right) {
    let pivotIdx = partition(arr, left, right);
    quickSort(arr, left, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, right);
  }
  return arr;
}`
    },
    'linear-search': {
        name: 'Linear Search',
        category: 'searching',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        difficulty: 'Easy',
        description: 'Checks every element in the array sequentially until the target element is found or the end of the array is reached.',
        practiceProblems: [
            { name: 'Linear Search', link: 'https://practice.geeksforgeeks.org/problems/linear-search/1' }
        ],
        code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
    },
    'binary-search': {
        name: 'Binary Search',
        category: 'searching',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        difficulty: 'Easy',
        description: 'A search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array.',
        practiceProblems: [
            { name: 'Binary Search', link: 'https://leetcode.com/problems/binary-search/' }
        ],
        code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
    }
};

const arrayPatterns = ['Random', 'Sorted', 'Reversed', 'Nearly Sorted'];

const AlgorithmView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const algoData = algorithmsData[id];

    const [arraySize, setArraySize] = useState(30);
    const [speed, setSpeed] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [arrayPattern, setArrayPattern] = useState('Random');

    // New History States
    const [executionHistory, setExecutionHistory] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetValue, setTargetValue] = useState(50);
    const [isSearching, setIsSearching] = useState(false);

    const [startTime, setStartTime] = useState(null);
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);

    const timersRef = useRef([]);

    useEffect(() => {
        if (!algoData) {
            navigate('/algorithms');
        } else {
            setIsSearching(id.includes('search'));
            generateNewArray(arraySize, arrayPattern);
        }
        return () => clearAllTimers();
    }, [id, navigate]);

    const clearAllTimers = () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    };

    const generateNewArray = (size, pattern = arrayPattern) => {
        clearAllTimers();
        setIsPlaying(false);
        setShowCompletionMessage(false);
        setArrayPattern(pattern);

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

        const arrCopy = [...newArr];
        let animations = [];
        if (id === 'bubble-sort') animations = bubbleSortAnimations(arrCopy);
        else if (id === 'selection-sort') animations = selectionSortAnimations(arrCopy);
        else if (id === 'insertion-sort') animations = insertionSortAnimations(arrCopy);
        else if (id === 'merge-sort') animations = mergeSortAnimations(arrCopy);
        else if (id === 'quick-sort') animations = quickSortAnimations(arrCopy);
        else if (id === 'linear-search') animations = linearSearchAnimations(arrCopy, targetValue);
        else if (id === 'binary-search') {
            const sortedArr = [...arrCopy].sort((a, b) => a - b);
            animations = binarySearchAnimations(sortedArr, targetValue);
            newArr = [...sortedArr]; // Binary search requires sorted array
        }

        let currentArr = [...newArr];
        let comparisons = 0;
        let swaps = 0;
        let history = [];

        history.push({
            array: [...currentArr],
            colors: Array(size).fill('default'),
            activeCodeLine: -1,
            stats: { comparisons, swaps },
            stepDescription: 'Initial array state.'
        });

        for (let anim of animations) {
            let stepDescription = '';
            let codeLine = -1;
            let currentColors = Array(size).fill('default');
            let depth = anim.depth || 0;

            if (anim.type === 'compare') {
                if (anim.indices && anim.indices.length >= 1) {
                    currentColors[anim.indices[0]] = 'comparing';
                    if (anim.indices.length >= 2) {
                        currentColors[anim.indices[1]] = 'comparing';
                        stepDescription = `Comparing elements at indices ${anim.indices[0]} and ${anim.indices[1]}`;
                    } else {
                        stepDescription = `Checking index ${anim.indices[0]} against target ${targetValue}`;
                    }
                }
                comparisons++;
                codeLine = 3;
            } else if (anim.type === 'revert') {
                stepDescription = `Moving to next elements`;
            } else if (anim.type === 'swap') {
                currentColors[anim.indices[0]] = 'swapping';
                currentColors[anim.indices[1]] = 'swapping';
                currentArr = [...currentArr];
                currentArr[anim.indices[0]] = anim.values[0];
                currentArr[anim.indices[1]] = anim.values[1];
                swaps++;
                codeLine = 4;
                stepDescription = `Swapping ${anim.values[0]} and ${anim.values[1]}`;
            } else if (anim.type === 'found') {
                currentColors[anim.index] = 'sorted';
                stepDescription = `Found ${targetValue} at index ${anim.index}!`;
            } else if (anim.type === 'not_found') {
                stepDescription = `${targetValue} not found in the array.`;
            } else if (anim.type === 'compare_range') {
                for (let i = anim.range[0]; i <= anim.range[1]; i++) {
                    currentColors[i] = 'comparing';
                }
                currentColors[anim.mid] = 'current';
                stepDescription = `Checking range [${anim.range[0]}, ${anim.range[1]}]. Midpoint digit is ${currentArr[anim.mid]}.`;
            } else if (anim.type === 'overwrite') {
                currentColors[anim.index] = 'swapping';
                currentArr = [...currentArr];
                currentArr[anim.index] = anim.value;
                swaps++;
                codeLine = 4;
                stepDescription = `Overwriting index ${anim.index} with ${anim.value}`;
            } else if (anim.type === 'call') {
                stepDescription = `Recursive call: range [${anim.range[0]}, ${anim.range[1]}]`;
            } else if (anim.type === 'return') {
                stepDescription = `Returning from recursive call`;
            }

            history.push({
                type: anim.type,
                range: anim.range,
                array: currentArr,
                colors: currentColors,
                activeCodeLine: codeLine,
                stats: { comparisons, swaps, depth },
                stepDescription
            });
        }

        history.push({
            array: [...currentArr],
            colors: Array(size).fill('sorted'),
            activeCodeLine: -1,
            stats: { comparisons, swaps },
            stepDescription: 'Array is fully sorted!'
        });

        setExecutionHistory(history);
        setCurrentStep(0);
    };

    const handleSizeChange = (size) => {
        setArraySize(size);
        generateNewArray(size);
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

    // Playback loop using the pre-computed history
    useEffect(() => {
        let intervalId;
        if (isPlaying && currentStep < executionHistory.length - 1) {
            const maxSpeedMs = 500;
            const minSpeedMs = 10;
            const currentSpeedMs = maxSpeedMs - ((speed / 100) * (maxSpeedMs - minSpeedMs));

            intervalId = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= executionHistory.length - 2) {
                        setIsPlaying(false);
                        setShowCompletionMessage(true);
                        saveProgress();
                        return executionHistory.length - 1;
                    }
                    return prev + 1;
                });
            }, currentSpeedMs);
        } else if (isPlaying && currentStep >= executionHistory.length - 1) {
            setIsPlaying(false);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isPlaying, currentStep, speed, executionHistory.length]);

    const handlePlayPause = () => {
        if (!isPlaying && currentStep === 0) setStartTime(Date.now());
        if (!isPlaying && currentStep >= executionHistory.length - 1) {
            generateNewArray(arraySize);
            setTimeout(() => setIsPlaying(true), 100);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleStepForward = () => {
        if (currentStep < executionHistory.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleStepBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const currentState = executionHistory[currentStep] || {
        array: [],
        colors: [],
        activeCodeLine: -1,
        stats: { comparisons: 0, swaps: 0, depth: 0 },
        stepDescription: 'Loading...'
    };

    if (!algoData) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-primary-text dark:text-primary-text">Algorithm Not Found or Not Implemented Yet</h2>
            <button onClick={() => navigate('/algorithms')} className="mt-4 px-6 py-2 bg-primary-accent text-secondary-bg rounded-xl">Back to Catalog</button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-text dark:text-secondary-bg">{algoData.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-secondary-text dark:text-secondary-text capitalize">{algoData.category}</p>
                        {algoData.category === 'sorting' && (
                            <Link
                                to="/compare"
                                className="inline-flex items-center text-[10px] font-bold text-primary-accent dark:text-primary-accent hover:underline"
                            >
                                <RefreshCcw size={10} className="mr-1" /> Compare with others
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${algoData.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        algoData.difficulty === 'Intermediate' ? 'bg-amber-100 text-warning dark:bg-amber-900/30 dark:text-warning' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                        {algoData.difficulty}
                    </span>
                    <div className="flex gap-4">
                        <div className="text-center px-4 py-1.5 bg-primary-bg dark:bg-sidebar rounded-xl">
                            <span className="block text-xs text-secondary-text">Time</span>
                            <span className="font-mono font-bold text-primary-text dark:text-secondary-bg">{algoData.timeComplexity}</span>
                        </div>
                        <div className="text-center px-4 py-1.5 bg-primary-bg dark:bg-sidebar rounded-xl">
                            <span className="block text-xs text-secondary-text">Space</span>
                            <span className="font-mono font-bold text-primary-text dark:text-secondary-bg">{algoData.spaceComplexity}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
                {/* Left/Top Column: Stats & Code */}
                <div className="lg:col-span-1 flex flex-col gap-4 order-2 lg:order-1">
                    {/* Live Stats Row - Responsive Wrap */}
                    <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                        <div className="bg-primary-bg dark:bg-sidebar border border-border dark:border-border rounded-xl px-2 py-2 flex flex-col items-center justify-center shadow-sm">
                            <span className="text-secondary-text uppercase tracking-widest leading-none mb-1 text-[9px]">Comparisons</span>
                            <span className="font-mono font-bold text-sm text-primary-text dark:text-primary-text">{currentState.stats.comparisons}</span>
                        </div>
                        <div className="bg-primary-bg dark:bg-sidebar border border-border dark:border-border rounded-xl px-2 py-2 flex flex-col items-center justify-center shadow-sm">
                            <span className="text-secondary-text uppercase tracking-widest leading-none mb-1 text-[9px]">Swaps</span>
                            <span className="font-mono font-bold text-sm text-primary-text dark:text-primary-text">{currentState.stats.swaps}</span>
                        </div>
                        <div className="bg-primary-bg dark:bg-sidebar border border-border dark:border-border rounded-xl px-2 py-2 flex flex-col items-center justify-center shadow-sm">
                            <span className="text-secondary-text uppercase tracking-widest leading-none mb-1 text-[9px]">Memory</span>
                            <span className="font-mono font-bold text-sm text-primary-text dark:text-primary-text truncate">
                                {algoData.spaceComplexity === 'O(1)' ? 'Fixed' : `${arraySize * 4}B`}
                            </span>
                        </div>
                        <div className={`bg-primary-bg dark:bg-sidebar border border-border dark:border-border rounded-xl px-2 py-2 flex flex-col items-center justify-center shadow-sm transition-opacity ${currentState.stats.depth > 0 ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-secondary-text uppercase tracking-widest leading-none mb-1 text-[9px]">Depth</span>
                            <span className="font-mono font-bold text-sm text-primary-text dark:text-primary-text">{currentState.stats.depth}</span>
                        </div>
                    </div>

                    <div className="bg-sidebar rounded-xl overflow-hidden shadow-md flex-grow border border-border flex flex-col">
                        <div className="bg-sidebar px-4 py-2 flex items-center border-b border-border">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="ml-4 text-xs font-mono text-secondary-text">algorithm.js</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[13px] font-mono text-secondary-text flex-grow max-h-[350px] overflow-y-auto thin-scrollbar">
                            {algoData.code.split('\n').map((line, idx) => (
                                <div
                                    key={idx}
                                    className={`px-2 py-0.5 rounded transition-colors ${currentState.activeCodeLine === idx ? 'bg-primary-accent/30 border-l-2 border-primary-accent text-secondary-bg' : 'border-l-2 border-transparent hover:bg-sidebar/50'}`}
                                >
                                    <span className="opacity-30 mr-4 text-[10px] inline-block w-4 text-right select-none">{idx + 1}</span>
                                    {line}
                                </div>
                            ))}
                        </pre>
                        {currentState.stats.depth > 0 && (
                            <div className="p-3 border-t border-border bg-sidebar/50 max-h-[220px] overflow-y-auto thin-scrollbar">
                                <RecursionTree history={executionHistory} currentStep={currentStep} />
                            </div>
                        )}
                    </div>

                    <div className="bg-secondary-bg dark:bg-sidebar p-5 rounded-xl border border-border dark:border-border flex-none overflow-y-auto">
                        <h3 className="font-semibold text-primary-text dark:text-secondary-bg mb-2">Description</h3>
                        <p className="text-sm text-secondary-text dark:text-secondary-text leading-relaxed mb-4">
                            {algoData.description}
                        </p>
                        {algoData.practiceProblems && (
                            <div className="pt-4 border-t border-border dark:border-border">
                                <h4 className="text-xs font-bold text-secondary-text uppercase tracking-widest mb-3">Practice Problems</h4>
                                <div className="flex flex-col gap-2">
                                    {algoData.practiceProblems.map((prob, i) => (
                                        <a
                                            key={i}
                                            href={prob.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary-accent dark:text-primary-accent hover:underline flex items-center"
                                        >
                                            <CheckCircle2 size={14} className="mr-2 opacity-50" />
                                            {prob.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right/Top Column: Visualization Panel */}
                <div className="lg:col-span-2 flex flex-col order-1 lg:order-2">
                <div className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-md border border-border dark:border-border flex-grow relative overflow-hidden flex flex-col p-6 min-h-[400px]">
                    {showCompletionMessage && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300 px-4 py-2 rounded-full font-medium flex items-center text-sm shadow-md transition-all">
                            <CheckCircle2 size={16} className="mr-2" /> Sorting Complete! Progress saved.
                        </div>
                    )}

                    {/* Step Description Toast */}
                    {currentState.stepDescription && currentState.stepDescription !== 'Loading...' && !showCompletionMessage && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-primary-accent/90 text-primary-accent dark:bg-primary-accent/90 dark:text-white px-4 sm:px-6 py-1.5 rounded-full font-bold shadow-sm border border-primary-accent dark:border-primary-accent whitespace-nowrap transform transition-all text-[11px] sm:text-sm backdrop-blur-sm max-w-[90%] truncate">
                            {currentState.stepDescription}
                        </div>
                    )}

                    <div className="absolute top-4 right-4 z-10 flex space-x-2">
                        <select
                            disabled={isPlaying}
                            value={arrayPattern}
                            onChange={(e) => generateNewArray(arraySize, e.target.value)}
                            className="text-xs px-2 py-1 rounded bg-primary-bg dark:bg-sidebar text-slate-700 dark:text-secondary-text border border-border dark:border-border outline-none"
                        >
                            {arrayPatterns.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button
                            onClick={() => generateNewArray(arraySize)}
                            disabled={isPlaying}
                            className="p-1.5 bg-primary-bg dark:bg-sidebar text-secondary-text dark:text-secondary-text rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50 border border-border dark:border-border"
                            title="Randomize Data"
                        >
                            <RefreshCcw size={14} />
                        </button>
                    </div>

                    <div className="flex-grow flex items-end justify-center pb-6 gap-[1px] mt-12 overflow-x-auto min-h-[250px] sm:min-h-[350px]">
                        {currentState.array.map((val, idx) => (
                            <div
                                key={idx}
                                className={`flex-1 min-w-[2px] sm:min-w-[4px] rounded-t transition-colors duration-100 ${currentState.colors[idx] === 'comparing' ? 'bg-yellow-400' :
                                    currentState.colors[idx] === 'swapping' ? 'bg-rose-500' :
                                        currentState.colors[idx] === 'sorted' ? 'bg-emerald-400' :
                                            currentState.colors[idx] === 'current' ? 'bg-primary-accent' :
                                                'bg-primary-accent dark:bg-primary-accent'
                                    }`}
                                style={{ height: `${(val / 100) * 90}%` }}
                            />
                        ))}
                    </div>

                    {/* Execution Timeline */}
                    <div className="mt-auto border-t border-border dark:border-border pt-4 px-2 overflow-hidden">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                            {executionHistory.slice(Math.max(0, currentStep - 5), currentStep + 1).map((step, i) => (
                                <div
                                    key={i}
                                    className={`whitespace-nowrap px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tight transition-all ${step === currentState ? 'bg-primary-accent text-secondary-bg scale-110 shadow-sm' : 'bg-primary-bg dark:bg-sidebar text-secondary-text'
                                        }`}
                                >
                                    {step.stepDescription.includes('Comparing') ? 'Compare' :
                                        step.stepDescription.includes('Swapping') ? 'Swap' :
                                            step.stepDescription.includes('Overwriting') ? 'Insert' : 'Step'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <ControlPanel
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onReset={() => generateNewArray(arraySize)}
                    onStepForward={handleStepForward}
                    onStepBack={handleStepBack}
                    disableStepForward={currentStep >= executionHistory.length - 1}
                    disableStepBack={currentStep === 0}
                    speed={speed}
                    onSpeedChange={setSpeed}
                    arraySize={arraySize}
                    onArraySizeChange={handleSizeChange}
                    onGenerateRandom={() => generateNewArray(arraySize)}
                    customList={null}
                    onCustomListChange={(arr) => {
                        const size = arr.length;
                        setArraySize(size);
                        // Rebuild animation history from the custom input array
                        const arrCopy = [...arr];
                        let animations = [];
                        if (id === 'bubble-sort') animations = bubbleSortAnimations(arrCopy);
                        else if (id === 'selection-sort') animations = selectionSortAnimations(arrCopy);
                        else if (id === 'insertion-sort') animations = insertionSortAnimations(arrCopy);
                        else if (id === 'merge-sort') animations = mergeSortAnimations(arrCopy);
                        else if (id === 'quick-sort') animations = quickSortAnimations(arrCopy);
                        else if (id === 'linear-search') animations = linearSearchAnimations([...arr], targetValue);
                        else if (id === 'binary-search') {
                            const sorted = [...arr].sort((a, b) => a - b);
                            animations = binarySearchAnimations(sorted, targetValue);
                            arr = sorted;
                        }

                        let currentArr = [...arr];
                        let comparisons = 0, swaps = 0;
                        let history = [{ array: [...currentArr], colors: Array(size).fill('default'), activeCodeLine: -1, stats: { comparisons, swaps }, stepDescription: 'Custom array loaded.' }];

                        for (let anim of animations) {
                            let currentColors = Array(size).fill('default');
                            let stepDescription = '';
                            if (anim.type === 'compare') {
                                if (anim.indices[0] !== undefined) currentColors[anim.indices[0]] = 'comparing';
                                if (anim.indices[1] !== undefined) currentColors[anim.indices[1]] = 'comparing';
                                comparisons++; stepDescription = `Comparing indices ${anim.indices[0]} and ${anim.indices[1]}`;
                            } else if (anim.type === 'swap') {
                                currentColors[anim.indices[0]] = 'swapping'; currentColors[anim.indices[1]] = 'swapping';
                                currentArr = [...currentArr]; currentArr[anim.indices[0]] = anim.values[0]; currentArr[anim.indices[1]] = anim.values[1];
                                swaps++; stepDescription = `Swapping ${anim.values[0]} and ${anim.values[1]}`;
                            } else if (anim.type === 'overwrite') {
                                currentColors[anim.index] = 'swapping';
                                currentArr = [...currentArr]; currentArr[anim.index] = anim.value;
                                swaps++; stepDescription = `Placing ${anim.value} at index ${anim.index}`;
                            }
                            history.push({ type: anim.type, array: [...currentArr], colors: currentColors, activeCodeLine: -1, stats: { comparisons, swaps, depth: anim.depth || 0 }, stepDescription });
                        }
                        history.push({ array: [...currentArr], colors: Array(size).fill('sorted'), activeCodeLine: -1, stats: { comparisons, swaps }, stepDescription: 'Done!' });
                        setExecutionHistory(history);
                        setCurrentStep(0);
                        setIsPlaying(false);
                    }}
                    targetValue={targetValue}
                    onTargetValueChange={setTargetValue}
                    isSearching={isSearching}
                />
                </div>
            </div>
        </div>
    );
};

function max(a, b) { return a > b ? a : b; }

export default AlgorithmView;
