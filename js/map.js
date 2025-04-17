import { renderInventory } from "./ui.js";
import { loadCombatScene } from "./combat.js"; // Import the combat scene function
import { combatState } from "./state.js"; // Import the combat state

const nodes = [
    { id: 1, type: "combat", symbol: "👁️", label: "Specter Revealed" },
    { id: 2, type: "shop", symbol: "🕯️", label: "Backstage Curio" },
    { id: 3, type: "event", symbol: "🎭", label: "Whispers in the Wings" }
];


//render node selection
export function renderMap() {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = ""; // Clear previous content

    // Create a wrapper div for node layout
    const mapView = document.createElement("div");
    mapView.className = "map-view";

    for (const node of nodes) {
        const nodeElement = document.createElement("div");
        nodeElement.className = "node" + " " + node.type;
        nodeElement.innerHTML = `<span>${node.symbol}</span>`;
        nodeElement.setAttribute("data-id", node.id);

        nodeElement.addEventListener("click", () => {
            if (node.type === "combat") {
                loadCombatScene();
            } else {
                loadNodeScene(node); // Load the node scene

            }
        });

        mapView.appendChild(nodeElement);
    }

    mapContainer.appendChild(mapView); // Add the node row to the container
}


export function loadNodeScene(node) {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = "";

    const nodeElement = document.createElement("div");
    nodeElement.className = "scene";

    let title = document.createElement("h2");

    switch(node.type) {
        case "combat":
            title.textContent = "👁️ An Audience Has Awakened...";
            break;
        case "shop":
            title.textContent = "🕯️ The Curio Vault Cracks Open...";
            break;
        case "event":
            title.textContent = "🎭 A Whisper Dances Through the Wings...";
            break;
        default:
            title.textContent = "Unknown Node";
    }

    nodeElement.appendChild(title);
    mapContainer.appendChild(nodeElement);
    renderInventory(); // Call renderInventory to display the inventory sidebar
}