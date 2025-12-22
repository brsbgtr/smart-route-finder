// Dijkstra Algoritması
function findShortestPath(graph, startNode, endNode) {
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue();

    // 1. Başlangıç durumu: Tüm mesafeler sonsuz, başlangıç 0
    graph.nodes.forEach(node => {
        distances[node] = Infinity;
        prev[node] = null;
    });
    distances[startNode] = 0;
    pq.enqueue(startNode, 0);

    while (!pq.isEmpty()) {
        let minNode = pq.dequeue().element;

        if (minNode === endNode) {
            // Hedefe ulaştık! Geriye doğru yolu kuralım
            let path = [];
            let curr = endNode;
            while (curr) {
                path.unshift(curr); // Başa ekle
                curr = prev[curr];
            }
            return { path: path, distance: distances[endNode] };
        }

        let neighbors = graph.edges[minNode] || [];
        neighbors.forEach(neighbor => {
            let alt = distances[minNode] + neighbor.weight;
            if (alt < distances[neighbor.node]) {
                distances[neighbor.node] = alt;
                prev[neighbor.node] = minNode;
                pq.enqueue(neighbor.node, alt);
            }
        });
    }
    return null; // Yol bulunamadı
}

// Yardımcı Sınıf: Öncelik Kuyruğu (En küçük mesafeyi hızlı bulmak için)
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        let qElement = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                added = true;
                break;
            }
        }
        if (!added) this.items.push(qElement);
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}