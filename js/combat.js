// ===== combat.js =====

import { combatState, applyMaskEffect, applyMaskPassives, unapplyMaskPassives } from "./state.js";
import { renderInventory } from "./ui.js";

export function loadCombatScene() {
  const mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = "";

  const sceneDiv = document.createElement("div");
  sceneDiv.className = "scene";

  const title = document.createElement("h2");
  title.textContent = `An Aberration Appears...`;

  const stats = document.createElement("div");
  stats.innerHTML = `
    <p>Sanity: ${combatState.masked.sanity} / ${combatState.masked.maxSanity}</p>
    <p>Echo: ${combatState.masked.echo} / ${combatState.masked.maxEcho}</p>
    <p>Enemy Vitality: ${combatState.aberration.vitality} / ${combatState.aberration.maxVitality}</p>
    <p>Scene: ${combatState.scene}</p>
  `;

  const actionBar = document.createElement("div");
  actionBar.className = "action-bar";

  const buttons = [
    { label: "Invoke Lash (2)", action: "lash" },
    { label: "Dodge (1)", action: "dodge" },
    { label: "Compose (+1)", action: "compose" },
    { label: "Switch Mask (1)", action: "switchMask" }
  ];

  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.textContent = btn.label;
    b.onclick = () => performInvocation(btn.action);
    actionBar.appendChild(b);
  });

  // Mask specific abilities
  const equipped = combatState.masked.masks[0];
  if (equipped === "resonantShroud") {
    const btn = document.createElement("button");
    btn.textContent = "Resonate (3)";
    btn.onclick = () => performInvocation("resonate");
    actionBar.appendChild(btn);
  }
  if (equipped === "aethericDiadem") {
    const btn = document.createElement("button");
    btn.textContent = "Aetheric Strike (3)";
    btn.onclick = () => performInvocation("aethericStrike");
    actionBar.appendChild(btn);
  }

  sceneDiv.appendChild(title);
  sceneDiv.appendChild(stats);
  sceneDiv.appendChild(actionBar);
  mapContainer.appendChild(sceneDiv);

  renderInventory();
}

export function performInvocation(type) {
  const masked = combatState.masked;
  const aberration = combatState.aberration;

  if (type === "switchMask") {
    if (masked.echo < 1) return alert("Echo is feeling low...");
    masked.echo -= 1;
    const [current, carried] = masked.masks;
    unapplyMaskPassives(current);
    masked.masks = [carried, current];
    applyMaskPassives(masked.masks[0]);
  } else if (type === "lash") {
    if (masked.echo < 2) return alert("Echo is feeling low...");
    masked.echo -= 2;
    aberration.vitality -= 2;
  } else if (type === "dodge") {
    if (masked.echo < 1) return alert("Echo is feeling low...");
    masked.echo -= 1;
    masked.isGuarding = true;
  } else if (type === "compose") {
    masked.echo = Math.min(masked.echo + 1, masked.maxEcho);
    applyMaskEffect("compose");
  } else {
    const success = applyMaskEffect(type);
    if (!success) return;
  }

  // Enemy attack
  if (aberration.vitality > 0) {
    let damage = 2;
    if (masked.isGuarding) damage -= 1;
    masked.sanity -= Math.max(0, damage);
    masked.isGuarding = false;
  }

  masked.echo = Math.min(masked.echo + 1, masked.maxEcho);
  combatState.scene++;

  if (aberration.vitality <= 0) return endCombat("victory");
  if (masked.sanity <= 0) return endCombat("defeat");

  loadCombatScene();
}

function endCombat(result) {
  const mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = "";

  const message = document.createElement("h2");
  message.textContent =
    result === "victory"
      ? "The Aberration is silenced..."
      : "Your sanity shatters...";

  mapContainer.appendChild(message);
}
