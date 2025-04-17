// ==== Mask Catalog ====
export const maskCatalog = {
    resonantShroud: {
      name: "Resonant Shroud",
      description: "Compose grants +2 Echo and grants: Resonate."
    },
    aethericDiadem: {
      name: "Aetheric Diadem",
      description: "Max Echo +1 and grants: Aetheric Strike."
    }
  };
  
  // ==== Combat State ====
  export const combatState = {
    masked: {
      sanity: 100,
      maxSanity: 100,
      echo: 3,
      maxEcho: 6,
      isGuarding: false,
      props: [],
      masks: ["resonantShroud", "aethericDiadem"]
    },
    aberration: {
      vitality: 10,
      maxVitality: 10
    },
    scene: 1
  };
  
  // ==== Passives ====
  export function applyMaskPassives(maskId) {
    const character = combatState.masked;
  
    if (maskId === "aethericDiadem") {
      character.maxEcho += 1;
      if (character.echo > character.maxEcho) {
        character.echo = character.maxEcho;
      }
    }
  }
  
  export function unapplyMaskPassives(maskId) {
    const character = combatState.masked;
  
    if (maskId === "aethericDiadem") {
      character.maxEcho -= 1;
      if (character.echo > character.maxEcho) {
        character.echo = character.maxEcho;
      }
    }
  }
  
  // ==== Active Mask Abilities ====
  export function applyMaskEffect(type) {
    const masked = combatState.masked;
    const aberration = combatState.aberration;
  
    switch (masked.masks[0]) {
      case "resonantShroud":
        if (type === "compose") {
          masked.echo = Math.min(masked.echo + 1, masked.maxEcho); // +1 bonus
        }
        if (type === "resonate") {
          if (masked.echo < 3) {
            alert("Echo is feeling low...");
            return false;
          }
          masked.echo -= 3;
          aberration.vitality -= 4;
        }
        break;
  
      case "aethericDiadem":
        if (type === "aethericStrike") {
          if (masked.echo < 3) {
            alert("Echo is feeling low...");
            return false;
          }
          masked.echo -= 3;
          aberration.vitality -= 5;
        }
        break;
    }
  
    return true;
  }
  