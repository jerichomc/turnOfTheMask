// ===== combat.js =====

import {
  combatState,
  applyMaskEffect,
  applyMaskPassives,
  unapplyMaskPassives,
  logMessage
} from "./state.js";
import { renderInventory } from "./ui.js";

export function loadCombatScene() {
  const mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = "";

  const sceneDiv = document.createElement("div");
  sceneDiv.className = "scene";

  const title = document.createElement("h2");
  title.textContent = `Scene ${combatState.scene}: An Aberration Appears...`;

  //===enemy health ====
  const enemyHealthBar = document.createElement("div");
  enemyHealthBar.className = "enemy-health-bar";

  const enemyHealthFill = document.createElement("div");
  enemyHealthFill.className = "enemy-health-fill";
  enemyHealthFill.style.width = `${(combatState.aberration.vitality
     / combatState.aberration.maxVitality) * 100}%`;

  enemyHealthBar.appendChild(enemyHealthFill);
  sceneDiv.appendChild(enemyHealthBar);

  // ===== Action Bar =====
  const actionBar = document.createElement("div");
  actionBar.className = "action-bar";

  // ===== Resource Display (Health bar + Echo orbs) =====
  const resourceDisplay = document.createElement("div");
  resourceDisplay.className = "resource-display";

  const healthBar = document.createElement("div");
  healthBar.className = "health-bar";
  const healthFill = document.createElement("div");
  healthFill.className = "health-fill";
  healthFill.style.width = `${(combatState.masked.sanity / combatState.masked.maxSanity) * 100}%`;
  healthFill.textContent = `${combatState.masked.sanity} / ${combatState.masked.maxSanity}`;
  healthBar.appendChild(healthFill);

  if (combatState.masked.sanity / combatState.masked.maxSanity < 0.3) {
    healthBar.classList.add("low-health"); // ✅ Change this to healthBar
  } else {
    healthBar.classList.remove("low-health");
  }
  

  const echoOrbs = document.createElement("div");
  echoOrbs.className = "echo-orbs";
  for (let i = 0; i < combatState.masked.maxEcho; i++) {
    const orb = document.createElement("div");
    orb.className = "echo-orb";
    if (i < combatState.masked.echo) orb.classList.add("glow");
    echoOrbs.appendChild(orb);
  }

  resourceDisplay.appendChild(healthBar);
  resourceDisplay.appendChild(echoOrbs);
  actionBar.appendChild(resourceDisplay);

  // ===== Main Buttons =====
  const buttons = [
    { label: "Lash (2)", action: "lash" },
    { label: "Dodge (1)", action: "dodge" },
    { label: "Compose (+1)", action: "compose" },
    { label: "Switch Mask (1)", action: "switchMask" },
  ];

  buttons.forEach((btn) => {
    const b = document.createElement("button");
    b.textContent = btn.label;
    b.onclick = () => performInvocation(btn.action);
    actionBar.appendChild(b);
  });

  // ===== Mask-specific abilities =====
  const equipped = combatState.masked.masks[0];
  if (equipped === "resonantShroud") {
    const btn = document.createElement("button");
    btn.textContent = "Resonate (3)";
    btn.onclick = () => performInvocation("resonate");
    actionBar.appendChild(btn);
  } else if (equipped === "aethericDiadem") {
    const btn = document.createElement("button");
    btn.textContent = "Aetheric Strike (3)";
    btn.onclick = () => performInvocation("aethericStrike");
    actionBar.appendChild(btn);
  }

  // ===== DOM Assembly =====
  sceneDiv.appendChild(title);
  mapContainer.appendChild(sceneDiv);
  mapContainer.appendChild(actionBar);

  renderInventory();
}

export function performInvocation(type) {
  const masked = combatState.masked;
  const aberration = combatState.aberration;

  // Disable buttons during delay
  const allButtons = document.querySelectorAll(".action-bar button");
  allButtons.forEach(btn => btn.disabled = true);

  if (type === "switchMask") {
    if (masked.echo < 1) return alert("Echo is feeling low...");
    masked.echo -= 1;
    updateEchoOrbs();
    logMessage("Switched masks!");
    const [current, carried] = masked.masks;
    unapplyMaskPassives(current);
    masked.masks = [carried, current];
    applyMaskPassives(masked.masks[0]);
  } else if (type === "lash") {
    if (masked.echo < 2) return alert("Echo is feeling low...");
    masked.echo -= 2;
    updateEchoOrbs();
    aberration.vitality -= 2;
    logMessage("You invoked Lash!");
  } else if (type === "dodge") {
    if (masked.echo < 1) return alert("Echo is feeling low...");
    masked.echo -= 1;
    updateEchoOrbs();
    masked.isGuarding = true;
    logMessage("You invoked Dodge!");
  } else if (type === "compose") {
    masked.echo = Math.min(masked.echo + 1, masked.maxEcho);
    applyMaskEffect("compose");
    updateEchoOrbs();
    logMessage("You invoked Compose!");
  } else {
    const success = applyMaskEffect(type);
    if (!success) return; 
  }

  setTimeout(() => {
    if (aberration.vitality > 0) {
      let damage = 3;
      if (masked.isGuarding) damage -= 1;
      masked.sanity -= Math.max(0, damage);
      masked.isGuarding = false;
      logMessage("Aberration attacks!");
    }

    masked.echo = Math.min(masked.echo + 1, masked.maxEcho);
    combatState.scene++;
    logMessage("+1 Echo regained.");

    if (aberration.vitality <= 0) return endCombat("victory");
    if (masked.sanity <= 0) return endCombat("defeat");

    loadCombatScene();
  }, 700);
}

function updateEchoOrbs() {
  const orbs = document.querySelectorAll(".echo-orb");
  orbs.forEach((orb, index) => {
    orb.classList.toggle("glow", index < combatState.masked.echo);
  });
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