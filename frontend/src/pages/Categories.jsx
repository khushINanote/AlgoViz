import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart2, Search as SearchIcon, Network, Layers } from 'lucide-react';

const categories = [
    { id: 'sorting', name: 'Sorting', icon: <BarChart2 size={24} />, description: 'Bubble, Selection, Insertion, Merge, Quick, Heap' },
    { id: 'searching', name: 'Searching', icon: <SearchIcon size={24} />, description: 'Linear Search, Binary Search' },
    { id: 'graph', name: 'Graph', icon: <Network size={24} />, description: 'BFS, DFS, Dijkstra' },
    { id: 'data-structures', name: 'Data Structures', icon: <Layers size={24} />, description: 'Stack, Queue, Linked List, BST' }
];

const algorithms = [
    { id: 'bubble-sort', category: 'sorting', name: 'Bubble Sort', difficulty: 'Easy' },
    { id: 'selection-sort', category: 'sorting', name: 'Selection Sort', difficulty: 'Easy' },
    { id: 'insertion-sort', category: 'sorting', name: 'Insertion Sort', difficulty: 'Easy' },
    { id: 'merge-sort', category: 'sorting', name: 'Merge Sort', difficulty: 'Medium' },
    { id: 'quick-sort', category: 'sorting', name: 'Quick Sort', difficulty: 'Medium' },
    { id: 'linear-search', category: 'searching', name: 'Linear Search', difficulty: 'Easy' },
    { id: 'binary-search', category: 'searching', name: 'Binary Search', difficulty: 'Easy' },
    { id: 'linked-list', category: 'data-structures', name: 'Singly Linked List', difficulty: 'Easy' },
    { id: 'reverse-linked-list', category: 'data-structures', name: 'Reverse Singly Linked List', difficulty: 'Medium' },
    { id: 'doubly-linked-list', category: 'data-structures', name: 'Doubly Linked List', difficulty: 'Easy' },
    { id: 'reverse-doubly-linked-list', category: 'data-structures', name: 'Reverse Doubly Linked List', difficulty: 'Medium' },
    { id: 'stack', category: 'data-structures', name: 'Stack (LIFO)', difficulty: 'Easy' },
    { id: 'queue', category: 'data-structures', name: 'Queue (FIFO)', difficulty: 'Easy' },
    { id: 'bfs', category: 'graph', name: 'Breadth First Search (BFS)', difficulty: 'Medium' },
    { id: 'dfs', category: 'graph', name: 'Depth First Search (DFS)', difficulty: 'Medium' },
];

const Categories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredAlgorithms = algorithms.filter(algo =>
        algo.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (activeCategory === 'all' || algo.category === activeCategory)
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-text dark:text-secondary-bg">Algorithm Library</h1>
                    <p className="text-secondary-text dark:text-secondary-text mt-2 flex items-center gap-4">
                        Explore and visualize different algorithms and data structures.
                        <Link to="/compare" className="inline-flex items-center px-3 py-1 bg-primary-accent text-white dark:bg-primary-accent/40 dark:text-white text-xs font-bold rounded-full border border-primary-accent dark:border-primary-accent hover:opacity-90 transition-opacity">
                            <BarChart2 size={12} className="mr-1" /> Compare Algorithms
                        </Link>
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search algorithms..."
                        className="w-full pl-10 pr-4 py-2 border border-border dark:border-border rounded-xl text-sm bg-secondary-bg dark:bg-sidebar text-primary-text dark:text-secondary-bg focus:ring-2 focus:ring-primary-accent outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-secondary-text" size={18} />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`p-4 rounded-xl flex items-center justify-center space-x-2 border transition-all ${activeCategory === 'all' ? 'border-primary-accent bg-primary-accent dark:bg-primary-accent/30 text-white dark:text-white font-semibold' : 'border-border dark:border-border bg-secondary-bg dark:bg-sidebar text-secondary-text dark:text-secondary-text hover:bg-primary-bg dark:hover:bg-slate-700'}`}
                >
                    <span>All Categories</span>
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 border transition-all ${activeCategory === cat.id ? 'border-primary-accent bg-primary-accent dark:bg-primary-accent/30 text-white dark:text-white font-semibold' : 'border-border dark:border-border bg-secondary-bg dark:bg-sidebar text-secondary-text dark:text-secondary-text hover:bg-primary-bg dark:hover:bg-slate-700'}`}
                    >
                        {cat.icon}
                        <span className="text-sm">{cat.name}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlgorithms.map((algo) => (
                    <Link to={algo.category === 'sorting' || algo.category === 'searching' ? `/algorithms/${algo.id}` : (algo.category === 'graph' ? `/graphs/${algo.id}` : `/data-structures/${algo.id}`)} key={algo.id} className="bg-secondary-bg dark:bg-sidebar rounded-xl shadow-sm hover:shadow-md border border-border dark:border-border p-6 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-primary-text dark:text-secondary-bg group-hover:text-primary-accent dark:group-hover:text-primary-accent transition-colors">{algo.name}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${algo.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-warning dark:bg-amber-900/30 dark:text-warning'}`}>
                                {algo.difficulty}
                            </span>
                        </div>
                        <p className="text-sm text-secondary-text dark:text-secondary-text capitalize">{algo.category}</p>
                    </Link>
                ))}
                {filteredAlgorithms.length === 0 && (
                    <div className="col-span-full text-center py-10 text-secondary-text">
                        No algorithms found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
