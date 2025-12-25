class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.bubbleUp();
    }

    dequeue() {
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }

    isEmpty() {
        return this.values.length === 0;
    }

    bubbleUp() {
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority) break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }

    sinkDown() {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];

        while (true) {
            let left = 2 * idx + 1;
            let right = 2 * idx + 2;
            let swap = null;

            if (left < length && this.values[left].priority < element.priority) {
                swap = left;
            }

            if (
                right < length &&
                ((swap === null && this.values[right].priority < element.priority) ||
                (swap !== null && this.values[right].priority < this.values[swap].priority))
            ) {
                swap = right;
            }

            if (swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}

class Dijkstra {
    constructor() {
        this.adjacencyList = {};
        this.nodes = {};
    }

    addNode(id, lat, lng) {
        if (!this.adjacencyList[id]) {
            this.adjacencyList[id] = [];
            this.nodes[id] = { lat, lng };
        }
    }

    addEdge(a, b, weight) {
        this.adjacencyList[a].push({ node: b, weight });
        this.adjacencyList[b].push({ node: a, weight });
    }

    findShortestPath(start, end) {
        const pq = new PriorityQueue();
        const distances = {};
        const previous = {};

        for (let node in this.adjacencyList) {
            distances[node] = Infinity;
            previous[node] = null;
        }

        distances[start] = 0;
        pq.enqueue(start, 0);

        while (!pq.isEmpty()) {
            const current = pq.dequeue().val;

            if (current === end) {
                const path = [];
                let temp = end;
                while (temp) {
                    path.push(temp);
                    temp = previous[temp];
                }
                return {
                    path: path.reverse(),
                    distance: distances[end]
                };
            }

            for (let neighbor of this.adjacencyList[current]) {
                let alt = distances[current] + neighbor.weight;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    previous[neighbor.node] = current;
                    pq.enqueue(neighbor.node, alt);
                }
            }
        }

        return null;
    }
}
