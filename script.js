var map = L.map('map').setView([41.0082, 28.9784], 14); // İstanbul'a odaklan

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var graphData = null;
var selectedNodes = []; // Seçilen noktaları tutar
var markers = {};      // Haritadaki işaretçileri tutar
var routeLine = null;  // Çizilen yol çizgisi

// 1. Veriyi JSON dosyasından çek
fetch('graph-data.json')
    .then(response => response.json())
    .then(data => {
        graphData = data;
        drawNodes(data);
    })
    .catch(error => console.error('Veri okunurken hata:', error));

// 2. Noktaları Haritaya Ekle (Mavi Pinler)
function drawNodes(data) {
    data.nodes.forEach(nodeKey => {
        let coords = data.coordinates[nodeKey];
        let name = data.nodeNames[nodeKey];

        // Haritaya marker ekle
        let marker = L.marker(coords).addTo(map);
        marker.bindPopup(`<b>${name}</b><br>Kodu: ${nodeKey}`);
        
        // Marker'a tıklama özelliği ekle
        marker.on('click', () => handleNodeClick(nodeKey));
        
        markers[nodeKey] = marker; // Marker'ı sakla
    });
    
    // Yolları gri çizgilerle göster (Görsellik için)
    drawGraphConnections(data);
}

// 3. Bağlantıları Çiz (Gri Çizgiler)
function drawGraphConnections(data) {
    for (let fromNode in data.edges) {
        let edges = data.edges[fromNode];
        let fromCoords = data.coordinates[fromNode];
        
        edges.forEach(edge => {
            let toCoords = data.coordinates[edge.node];
            L.polyline([fromCoords, toCoords], {color: 'grey', weight: 1, opacity: 0.5}).addTo(map);
        });
    }
}

// 4. Tıklama Mantığı
function handleNodeClick(nodeKey) {
    if (selectedNodes.length >= 2) {
        // Zaten 2 nokta seçiliyse sıfırla
        selectedNodes = [];
        if (routeLine) map.removeLayer(routeLine); // Eski yolu sil
        alert("Seçim sıfırlandı. Yeni başlangıç noktası seçin.");
    }

    selectedNodes.push(nodeKey);
    console.log("Seçilenler:", selectedNodes);

    if (selectedNodes.length === 1) {
        markers[nodeKey].openPopup(); // İlk seçileni göster
    } else if (selectedNodes.length === 2) {
        // İkinci nokta seçildi -> ROTA HESAPLA!
        calculateAndDrawRoute(selectedNodes[0], selectedNodes[1]);
    }
}

// 5. Rotayı Hesapla ve Çiz
function calculateAndDrawRoute(start, end) {
    let result = findShortestPath(graphData, start, end);
    
    if (result) {
        let pathCoordinates = result.path.map(nodeKey => graphData.coordinates[nodeKey]);
        
        // Kırmızı çizgi ile yolu çiz
        routeLine = L.polyline(pathCoordinates, {color: 'red', weight: 5}).addTo(map);
        map.fitBounds(routeLine.getBounds()); // Yola odaklan
        
        alert(`Rota Bulundu!\nYol: ${result.path.join(' -> ')}\nMesafe: ${result.distance} metre`);
    } else {
        alert("Bu iki nokta arasında yol bulunamadı!");
    }
}