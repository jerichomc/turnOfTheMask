import { combatState } from './state.js';
import { maskCatalog } from './state.js'; // if you use this too


export function renderInventory() {
    const sidebar = document.getElementById("left-sidebar");
    sidebar.innerHTML = ""; // Clear previous content
  
    const maskTitle = document.createElement("h3");
    maskTitle.textContent = "Masks";
    sidebar.appendChild(maskTitle);
  
    const maskList = document.createElement("div");
    maskList.className = "mask-list";
  
    const maskIds = combatState.masked.masks;
  
    maskIds.forEach((maskId, index) => {
      const maskData = maskCatalog[maskId];
  
      const maskItem = document.createElement("div");
      maskItem.className = "mask-item";
      maskItem.textContent =
        (index === 0 ? "🎭 Equipped: " : "🎭 Carried: ") + maskData.name;
  
      maskList.appendChild(maskItem);
    });
  
    sidebar.appendChild(maskList);
  
    // Placeholder for props section
    const propTitle = document.createElement("h3");
    propTitle.textContent = "Props";
    sidebar.appendChild(propTitle);
  }
  