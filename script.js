const map = L.map("map").setView([41.0082, 28.9784], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(map);

const graph = new Dijkstra();
let selectedNodes = [];
let markers = [];
let routeLine = null;

const statusEl = document.getElementById("status");


// İstanbul geneli
const BBOX = "40.7,28.5,41.3,29.5";

async function loadGraphData() {
    statusEl.innerText = "Yol verileri yükleniyor...";

    const query = `
        [out:json];
        (way["highway"](${BBOX}););
        (._;>;);
        out body;
    `;

    try {
        const res = await fetch(
            "https://overpass-api.de/api/interpreter?data=" +
            encodeURIComponent(query)
        );
        const data = await res.json();
        buildGraph(data);

        statusEl.innerText = "Hazır! İki nokta seçin.";
        statusEl.style.color = "green";
    } catch (err) {
        statusEl.innerText = "Veri alınamadı!";
        statusEl.style.color = "red";
        console.error(err);
    }
}

function buildGraph(data) {
    const nodes = {};

    data.elements.forEach(el => {
        if (el.type === "node") {
            nodes[el.id] = el;
            graph.addNode(String(el.id), el.lat, el.lon);
        }
    });

    data.elements.forEach(el => {
        if (el.type === "way") {
            for (let i = 0; i < el.nodes.length - 1; i++) {
                const a = el.nodes[i];
                const b = el.nodes[i + 1];
                if (nodes[a] && nodes[b]) {
                    const d = distance(
                        nodes[a].lat, nodes[a].lon,
                        nodes[b].lat, nodes[b].lon
                    );
                    graph.addEdge(String(a), String(b), d);
                }
            }
        }
    });
}

map.on("click", e => {
    if (selectedNodes.length === 2) reset();

    const nearest = findNearest(e.latlng.lat, e.latlng.lng);
    selectedNodes.push(nearest);

    const m = L.marker([
        graph.nodes[nearest].lat,
        graph.nodes[nearest].lng
    ])
        .addTo(map)
        .bindPopup(selectedNodes.length === 1 ? "Başlangıç" : "Bitiş")
        .openPopup();

    markers.push(m);

    if (selectedNodes.length === 2) runDijkstra();
});

function runDijkstra() {
    statusEl.innerText = "Hesaplanıyor...";

    const result = graph.findShortestPath(
        selectedNodes[0],
        selectedNodes[1]
    );

    if (!result) {
        statusEl.innerText = "Yol bulunamadı.";
        return;
    }

    const coords = result.path.map(id => [
        graph.nodes[id].lat,
        graph.nodes[id].lng
    ]);

    routeLine = L.polyline(coords, {
        color: "red",
        weight: 5
    }).addTo(map);

    map.fitBounds(routeLine.getBounds());

    statusEl.innerHTML =
        `Rota bulundu<br>Mesafe: ${Math.round(result.distance)} metre`;
}

function reset() {
    selectedNodes = [];
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    if (routeLine) map.removeLayer(routeLine);
}

function findNearest(lat, lng) {
    let min = Infinity;
    let closest = null;

    for (let id in graph.nodes) {
        const n = graph.nodes[id];
        const d = distance(lat, lng, n.lat, n.lng);
        if (d < min) {
            min = d;
            closest = id;
        }
    }
    return closest;
}

function distance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

loadGraphData();
