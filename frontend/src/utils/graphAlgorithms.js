export const bfsAnimations = (nodes, edges, startNodeId) => {
    const animations = [];
    const visited = new Set();
    const queue = [startNodeId];

    // Create adjacency list based on hardcoded topology
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push(e.target);
        adj[e.target].push(e.source); // undirected
    });

    visited.add(startNodeId);
    animations.push({ type: 'ds_update', action: 'enqueue', ds: [...queue] });
    animations.push({ type: 'visit_node', id: startNodeId, state: 'visiting' });

    while (queue.length > 0) {
        const curr = queue.shift();
        animations.push({ type: 'ds_update', action: 'dequeue', ds: [...queue] });
        animations.push({ type: 'visit_node', id: curr, state: 'current' });

        for (const neighbor of adj[curr]) {
            animations.push({ type: 'visit_edge', source: curr, target: neighbor });
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                animations.push({ type: 'ds_update', action: 'enqueue', ds: [...queue] });
                animations.push({ type: 'visit_node', id: neighbor, state: 'queued' });
            }
        }

        animations.push({ type: 'visit_node', id: curr, state: 'visited' });
    }

    return animations;
};

export const dfsAnimations = (nodes, edges, startNodeId) => {
    const animations = [];
    const visited = new Set();
    const stack = [];

    const adj = {};
    nodes.forEach(n => adj[n.id] = []);

    // Sort neighbors to ensure deterministic rendering (alphabetical)
    edges.forEach(e => {
        adj[e.source].push(e.target);
        adj[e.target].push(e.source);
    });

    for (const key in adj) {
        adj[key].sort();
    }

    const dfsHelper = (curr) => {
        visited.add(curr);
        stack.push(curr);
        animations.push({ type: 'ds_update', action: 'push', ds: [...stack].reverse() });
        animations.push({ type: 'visit_node', id: curr, state: 'current' });

        for (const neighbor of adj[curr]) {
            animations.push({ type: 'visit_edge', source: curr, target: neighbor });
            if (!visited.has(neighbor)) {
                animations.push({ type: 'visit_node', id: neighbor, state: 'visiting' });
                dfsHelper(neighbor);
                // Backtrack visualization
                animations.push({ type: 'backtrack_edge', source: curr, target: neighbor });
                animations.push({ type: 'visit_node', id: curr, state: 'current' });
            }
        }
        animations.push({ type: 'visit_node', id: curr, state: 'visited' });
        stack.pop();
        animations.push({ type: 'ds_update', action: 'pop', ds: [...stack].reverse() }); // Reverse for UI 'Top'
    };

    dfsHelper(startNodeId);
    return animations;
};

export const dijkstraAnimations = (nodes, edges, startNodeId) => {
    const animations = [];
    const distances = {};
    const visited = new Set();
    const pq = [{ id: startNodeId, dist: 0 }];

    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push({ node: e.target, weight: e.weight || 1 });
        adj[e.target].push({ node: e.source, weight: e.weight || 1 });
    });

    nodes.forEach(n => distances[n.id] = Infinity);
    distances[startNodeId] = 0;

    animations.push({ type: 'visit_node', id: startNodeId, state: 'current' });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { id: curr, dist: d } = pq.shift();

        if (visited.has(curr)) continue;
        visited.add(curr);

        animations.push({ type: 'visit_node', id: curr, state: 'current' });
        animations.push({ type: 'ds_update', ds: pq.map(i => `${i.id}(${i.dist})`) });

        for (const neighbor of adj[curr]) {
            const newDist = d + neighbor.weight;
            animations.push({ type: 'visit_edge', source: curr, target: neighbor.node });

            if (newDist < distances[neighbor.node]) {
                distances[neighbor.node] = newDist;
                pq.push({ id: neighbor.node, dist: newDist });
                animations.push({ type: 'visit_node', id: neighbor.node, state: 'visiting' });
                animations.push({ type: 'ds_update', ds: pq.sort((a, b) => a.dist - b.dist).map(i => `${i.id}(${i.dist})`) });
            }
        }
        animations.push({ type: 'visit_node', id: curr, state: 'visited' });
    }

    return animations;
};
