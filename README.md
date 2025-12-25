# Smart Route Navigator

**Course:** CENG 3511 - Artificial Intelligence  
**Project:** Final Project - Shortest Path Finder using Dijkstra's Algorithm

## 📌 Project Overview
This project is a web-based application that finds the shortest path between two user-selected locations on a map. It utilizes **Leaflet.js** for map visualization and a custom implementation of **Dijkstra's Algorithm** to calculate the most efficient route based on weighted edges.

## 🚀 Features
- **Interactive Map:** Users can view nodes on a real-world map (Istanbul Historical Peninsula).
- **Node Selection:** Users can select a "Start" and "End" node by clicking on markers.
- **Shortest Path Calculation:** The application computes the route with the lowest cost using Dijkstra's Algorithm.
- **Visual Feedback:** The path is drawn dynamically with a red polyline, and the total distance/cost is displayed.

## 🛠️ Technologies Used
- **HTML5 & CSS3:** For structure and styling.
- **JavaScript (ES6):** For application logic and algorithm implementation.
- **Leaflet.js:** For rendering the map and markers.
- **JSON:** For storing graph data (nodes, coordinates, and edge weights).

## ⚙️ How to Run the Project
Since the project loads data from a local JSON file (`graph-data.json`), it requires a local server to avoid CORS policy errors.

1. **Clone or Download** the project folder.
2. Open a terminal inside the project folder.
3. Run the following command (if you have Python installed):
   ```bash
   python -m http.server 5500