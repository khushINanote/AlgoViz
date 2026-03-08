export const createLinkedListObj = (elements) => {
    let head = null;
    let curr = null;

    elements.forEach((val) => {
        const node = { val, next: null };
        if (!head) {
            head = node;
            curr = node;
        } else {
            curr.next = node;
            curr = node;
        }
    });

    return head;
};

// Generic DFS/BFS structure generator for testing
export const createGraphNodes = () => {
    return [
        { id: 'A', x: 50, y: 10, neighbors: ['B', 'C'] },
        { id: 'B', x: 20, y: 40, neighbors: ['A', 'D', 'E'] },
        { id: 'C', x: 80, y: 40, neighbors: ['A', 'F'] },
        { id: 'D', x: 10, y: 80, neighbors: ['B'] },
        { id: 'E', x: 30, y: 80, neighbors: ['B'] },
        { id: 'F', x: 70, y: 80, neighbors: ['C', 'G'] },
        { id: 'G', x: 90, y: 80, neighbors: ['F'] }
    ];
};
