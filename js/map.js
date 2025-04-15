const nodes = [
    {id: 1, type: "combat", symbol: "⚔️"},
    {id: 2, type: "shop", symbol: "🛒"},
    {id: 3, type: "event", symbol: "❗"}
];

//render node selection
function renderMap() {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = ""; // Clear previous content if there

    for(const node of nodes) {
        const nodeElement = document.createElement("div");
        nodeElement.className = "node" + " " + node.type;
        nodeElement.innerHTML = `<span>${node.symbol}</span>`;
        nodeElement.setAttribute("data-id", node.id);
        nodeElement.addEventListener("click", () => {
            loadNodeScene(node);
        });
        mapContainer.appendChild(nodeElement);
    }
}

function loadNodeScene(node) {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = "";

    const nodeElement = document.createElement("div");
    nodeElement.className = "scene";

    let title = document.createElement("h2");

    switch(node.type) {
        case "combat":
            title.textContent = "Encouter!";
            break;
        case "shop":
            title.textContent = "Welcome to my shop!";
            break;
        case "event":
            title.textContent = "A mysterious event... What could it be?";
            break;
        default:
            title.textContent = "Unknown Node";
    }

    nodeElement.appendChild(title);
    mapContainer.appendChild(nodeElement);
}