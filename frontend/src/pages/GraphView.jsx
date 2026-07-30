import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network, CheckCircle2 } from 'lucide-react';
import ControlPanel from '../components/ControlPanel';
import { bfsAnimations, dfsAnimations, dijkstraAnimations } from '../utils/graphAlgorithms';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const graphData = {
    'bfs': {
        name: 'Breadth First Search (BFS)',
        category: 'graph',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        description: 'Explores all nodes at the present depth level before moving on to the next depth level. Uses a Queue.',
        code: `function bfs(graph, start) {
  let queue = [start];
  let visited = new Set([start]);
  
  while (queue.length > 0) {
    let curr = queue.shift();
    console.log(curr);
    
    for (let neighbor of graph[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`
    },
    'dfs': {
        name: 'Depth First Search (DFS)',
        category: 'graph',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        description: 'Explores as far as possible along each branch before backtracking. Uses a Stack (or recursion).',
        code: `function dfs(graph, curr, visited = new Set()) {
  visited.add(curr);
  console.log(curr);
  
  for (let neighbor of graph[curr]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`
    },
    'dijkstra': {
        name: "Dijkstra's Algorithm",
        category: 'graph',
        timeComplexity: 'O((V+E) log V)',
        spaceComplexity: 'O(V)',
        description: "Finds the shortest path between nodes in a graph. Uses a Priority Queue.",
        code: `function dijkstra(graph, start) {
  let distances = { [start]: 0 };
  let pq = new PriorityQueue();
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    let { node, dist } = pq.dequeue();
    for (let neighbor of graph[node]) {
      let alt = dist + neighbor.weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        pq.enqueue(neighbor, alt);
      }
    }
  }
}`
    }
};

const initialNodes = [
    { id: 'A', x: 50, y: 15 },
    { id: 'B', x: 25, y: 40 },
    { id: 'C', x: 75, y: 40 },
    { id: 'D', x: 15, y: 75 },
    { id: 'E', x: 40, y: 75 },
    { id: 'F', x: 60, y: 80 },
    { id: 'G', x: 85, y: 70 },
    { id: 'H', x: 25, y: 95 },
];

const initialEdges = [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'D', weight: 5 },
    { source: 'B', target: 'E', weight: 10 },
    { source: 'C', target: 'F', weight: 3 },
    { source: 'C', target: 'G', weight: 8 },
    { source: 'E', target: 'H', weight: 1 },
    { source: 'F', target: 'A', weight: 7 },
];

const GraphView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const gData = graphData[id];

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const [nodeStates, setNodeStates] = useState({}); // id -> state string
    const [edgeStates, setEdgeStates] = useState({}); // 'sourcetarget' -> state string
    const [dsElements, setDsElements] = useState([]); // stack or queue elements

    const [speed, setSpeed] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);
    const [startTime, setStartTime] = useState(null);

    const timersRef = useRef([]);

    useEffect(() => {
        if (!gData) navigate('/algorithms');
        resetGraph();
        return () => clearAllTimers();
    }, [id, navigate]);

    const clearAllTimers = () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    };

    const resetGraph = () => {
        clearAllTimers();
        setIsPlaying(false);
        setIsFinished(false);
        setShowCompletionMessage(false);
        setDsElements([]);

        const initNodeStates = {};
        nodes.forEach(n => initNodeStates[n.id] = 'default');
        setNodeStates(initNodeStates);

        const initEdgeStates = {};
        edges.forEach(e => {
            initEdgeStates[`${e.source}${e.target}`] = 'default';
            initEdgeStates[`${e.target}${e.source}`] = 'default'; // undirected map
        });
        setEdgeStates(initEdgeStates);
    };

    const addNode = (id) => {
        if (!id || nodes.find(n => n.id === id)) return;
        const newNode = {
            id,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60
        };
        setNodes([...nodes, newNode]);
    };

    const addEdge = (source, target, weight) => {
        if (!source || !target || source === target) return;
        if (!nodes.find(n => n.id === source) || !nodes.find(n => n.id === target)) return;
        const newEdge = { source, target, weight: parseInt(weight) || 1 };
        setEdges([...edges, newEdge]);
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

    const runAlgorithm = () => {
        if (isFinished) return;
        setIsPlaying(true);
        setStartTime(Date.now());

        const startNodeId = nodes.find(n => n.id === 'A')?.id || nodes[0]?.id || 'A';
        let animations = [];
        if (id === 'bfs') animations = bfsAnimations(nodes, edges, startNodeId);
        else if (id === 'dfs') animations = dfsAnimations(nodes, edges, startNodeId);
        else if (id === 'dijkstra') animations = dijkstraAnimations(nodes, edges, startNodeId);

        const maxSpeedMs = 1200;
        const minSpeedMs = 100;
        const currentSpeedMs = maxSpeedMs - ((speed / 100) * (maxSpeedMs - minSpeedMs));

        animations.forEach((anim, idx) => {
            const timer = setTimeout(() => {
                if (anim.type === 'ds_update') {
                    setDsElements(anim.ds);
                } else if (anim.type === 'visit_node') {
                    setNodeStates(prev => ({ ...prev, [anim.id]: anim.state }));
                } else if (anim.type === 'visit_edge') {
                    setEdgeStates(prev => {
                        const n = { ...prev };
                        n[`${anim.source}${anim.target}`] = 'visiting';
                        n[`${anim.target}${anim.source}`] = 'visiting';
                        return n;
                    });
                    // Auto revert edge to visited after a short delay
                    setTimeout(() => {
                        setEdgeStates(curr => ({
                            ...curr,
                            [`${anim.source}${anim.target}`]: 'visited',
                            [`${anim.target}${anim.source}`]: 'visited'
                        }));
                    }, currentSpeedMs / 2);
                } else if (anim.type === 'backtrack_edge') {
                    setEdgeStates(prev => ({
                        ...prev,
                        [`${anim.source}${anim.target}`]: 'backtracking',
                        [`${anim.target}${anim.source}`]: 'backtracking'
                    }));
                }

                if (idx === animations.length - 1) {
                    setIsPlaying(false);
                    setIsFinished(true);
                    saveProgress();

                    // Map all current to visited at the very end
                    setNodeStates(prev => {
                        const final = { ...prev };
                        Object.keys(final).forEach(k => final[k] = 'visited');
                        return final;
                    });
                    setShowCompletionMessage(true);
                }
            }, idx * currentSpeedMs);
            timersRef.current.push(timer);
        });
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            clearAllTimers();
            setIsPlaying(false);
        } else {
            runAlgorithm();
        }
    };

    if (!gData) return null;

    // Render SVG Edges correctly handling percentages mapping to pixel positions if needed, 
    // but since we are within a relative box, percent is fine for x1,y1 
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-[calc(100vh-140px)]">
            {/* Header duplicated logic from AlgoView for consistency */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-text dark:text-secondary-bg flex items-center">
                        <Network className="mr-3 text-primary-accent" /> {gData.name}
                    </h1>
                    <p className="text-sm text-secondary-text dark:text-secondary-text capitalize">{gData.category}</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-4 py-1.5 bg-primary-bg dark:bg-sidebar rounded-xl">
                        <span className="block text-xs text-secondary-text">Time</span>
                        <span className="font-mono font-bold text-primary-text dark:text-secondary-bg">{gData.timeComplexity}</span>
                    </div>
                    <div className="text-center px-4 py-1.5 bg-primary-bg dark:bg-sidebar rounded-xl">
                        <span className="block text-xs text-secondary-text">Space</span>
                        <span className="font-mono font-bold text-primary-text dark:text-secondary-bg">{gData.spaceComplexity}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
                {/* Code Panel */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-sidebar rounded-xl overflow-hidden shadow-md flex-grow border border-border">
                        <div className="bg-sidebar px-4 py-2 flex items-center border-b border-border">
                            <span className="text-xs font-mono text-secondary-text">algorithm.js</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm font-mono text-secondary-text min-h-[250px]">
                            {gData.code}
                        </pre>
                    </div>

                    <div className="bg-secondary-bg dark:bg-sidebar p-5 rounded-xl border border-border dark:border-border flex-none min-h-[150px]">
                        <h3 className="font-semibold text-primary-text dark:text-secondary-bg mb-2">Description</h3>
                        <p className="text-sm text-secondary-text dark:text-secondary-text leading-relaxed">
                            {gData.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-primary-bg dark:bg-sidebar rounded text-secondary-text dark:text-secondary-text border border-border dark:border-border">Unvisited</span>
                            <span className="px-2 py-1 bg-yellow-100 text-warning dark:bg-yellow-900/30 dark:text-warning border border-yellow-200 dark:border-yellow-700 rounded">Queued/Visiting</span>
                            <span className="px-2 py-1 bg-primary-accent text-primary-accent dark:bg-primary-accent/50 dark:text-primary-accent border border-primary-accent dark:border-primary-accent rounded">Current Node</span>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600 rounded">Fully Visited</span>
                        </div>

                        {/* Custom Graph Builder */}
                        <div className="mt-4 p-4 bg-primary-bg dark:bg-sidebar/50 rounded-xl border border-border dark:border-border">
                            <h4 className="text-xs font-bold text-secondary-text uppercase tracking-widest mb-3">Custom Graph Builder</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-secondary-text uppercase">Add Node (ID)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Z"
                                        className="w-full mt-1 px-2 py-1 text-xs bg-secondary-bg dark:bg-sidebar border border-border dark:border-border rounded outline-none text-slate-700 dark:text-primary-text"
                                        onKeyDown={(e) => { if (e.key === 'Enter') { addNode(e.target.value.toUpperCase()); e.target.value = ''; } }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-secondary-text uppercase">Add Edge (S, T, W)</label>
                                    <div className="flex gap-1">
                                        <input id="edge-s" type="text" placeholder="S" className="w-8 px-1 py-1 text-xs bg-secondary-bg dark:bg-sidebar border border-border dark:border-border rounded text-center text-slate-700 dark:text-primary-text" />
                                        <input id="edge-t" type="text" placeholder="T" className="w-8 px-1 py-1 text-xs bg-secondary-bg dark:bg-sidebar border border-border dark:border-border rounded text-center text-slate-700 dark:text-primary-text" />
                                        <input id="edge-w" type="text" placeholder="W" className="w-8 px-1 py-1 text-xs bg-secondary-bg dark:bg-sidebar border border-border dark:border-border rounded text-center text-slate-700 dark:text-primary-text" />
                                        <button
                                            onClick={() => {
                                                const s = document.getElementById('edge-s').value.toUpperCase();
                                                const t = document.getElementById('edge-t').value.toUpperCase();
                                                const w = document.getElementById('edge-w').value;
                                                addEdge(s, t, w);
                                            }}
                                            className="px-2 py-1 bg-primary-accent text-secondary-bg text-[10px] rounded hover:bg-primary-accent transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visualization Panel */}
                <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-md border border-border dark:border-border flex-grow relative overflow-hidden flex flex-row min-h-[400px]">

                        {/* Graph Canvas */}
                        <div className="flex-grow relative border-r border-border dark:border-border">
                            {showCompletionMessage && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300 px-4 py-2 rounded-full font-medium flex items-center text-sm shadow-md transition-all">
                                    <CheckCircle2 size={16} className="mr-2" /> Traversal Complete!
                                </div>
                            )}

                            <svg className="absolute inset-0 w-full h-full z-0 p-4">
                                {edges.map((e, idx) => {
                                    const sNode = nodes.find(n => n.id === e.source);
                                    const tNode = nodes.find(n => n.id === e.target);
                                    const eState = edgeStates[`${e.source}${e.target}`] || 'default';

                                    let sClass = "stroke-slate-300 dark:stroke-slate-700 mix-blend-multiply dark:mix-blend-screen";
                                    if (eState === 'visiting') sClass = "stroke-indigo-500 animate-pulse drop-shadow-md";
                                    if (eState === 'visited') sClass = "stroke-emerald-400 dark:stroke-emerald-600";
                                    if (eState === 'backtracking') sClass = "stroke-rose-400 stroke-dasharray-4";

                                    return (
                                        <g key={idx}>
                                            <line
                                                x1={`${sNode.x}%`} y1={`${sNode.y}%`}
                                                x2={`${tNode.x}%`} y2={`${tNode.y}%`}
                                                strokeWidth={eState === 'visiting' ? 4 : 2}
                                                className={`transition-all duration-300 ${sClass}`}
                                            />
                                            <text
                                                x={`${(sNode.x + tNode.x) / 2}%`}
                                                y={`${(sNode.y + tNode.y) / 2}%`}
                                                dy="-5"
                                                textAnchor="middle"
                                                className="text-[10px] fill-slate-400 font-bold pointer-events-none"
                                            >
                                                {e.weight}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            <div className="absolute inset-4 z-10">
                                {nodes.map(n => {
                                    const state = nodeStates[n.id] || 'default';
                                    let bgClass = "bg-secondary-bg dark:bg-sidebar text-slate-700 dark:text-secondary-text border-border dark:border-border";
                                    if (state === 'queued' || state === 'visiting') bgClass = "bg-yellow-100 text-warning border-yellow-400 dark:bg-yellow-900/80 dark:text-warning dark:border-yellow-600 shadow-[0_0_15px_rgba(250,204,21,0.4)]";
                                    if (state === 'current') bgClass = "bg-primary-accent text-secondary-bg border-primary-accent shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110";
                                    if (state === 'visited') bgClass = "bg-emerald-100 text-emerald-800 border-emerald-400 dark:bg-emerald-900/80 dark:text-emerald-200 dark:border-emerald-600";

                                    return (
                                        <div
                                            key={n.id}
                                            className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ${bgClass}`}
                                            style={{ left: `${n.x}%`, top: `${n.y}%` }}
                                        >
                                            {n.id}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DS Sidebar */}
                        <div className="w-24 bg-primary-bg dark:bg-sidebar/50 flex flex-col border-l border-border dark:border-border shrink-0">
                            <div className="p-2 border-b border-border dark:border-border text-[10px] font-bold text-center text-secondary-text uppercase tracking-widest bg-primary-bg dark:bg-sidebar">
                                {id === 'bfs' ? 'Queue (Front)' : id === 'dijkstra' ? 'PQ (Min)' : 'Stack (Top)'}
                            </div>
                            <div className="flex-grow p-2 overflow-y-auto flex flex-col gap-2 items-center">
                                {dsElements.map((el, i) => (
                                    <div key={i} className="w-16 h-12 bg-primary-accent text-primary-accent dark:bg-primary-accent/60 dark:text-primary-accent border border-primary-accent dark:border-primary-accent rounded-xl flex items-center justify-center font-bold shadow-sm shrink-0 text-[10px]">
                                        {el}
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 border-t border-border dark:border-border text-[10px] font-bold text-center text-secondary-text uppercase tracking-widest bg-primary-bg dark:bg-sidebar">
                                {id === 'bfs' ? 'Queue (Rear)' : id === 'dijkstra' ? 'PQ (End)' : 'Stack (Bottom)'}
                            </div>
                        </div>

                    </div>
                    <ControlPanel
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onReset={resetGraph}
                        onStep={() => { }} // Stub
                        speed={speed}
                        onSpeedChange={setSpeed}
                        arraySize={10}
                        onArraySizeChange={() => { }}
                        onGenerateRandom={resetGraph}
                        customList={null}
                        onCustomListChange={() => { }}
                        targetValue={0}
                        onTargetValueChange={() => { }}
                        isSearching={false}
                    />
                </div>

            </div>
        </div>
    );
};

export default GraphView;
