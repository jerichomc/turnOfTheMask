
const combatState = {
    masked: {
      sanity: 10,
      maxSanity: 10,
      echo: 3,
      maxEcho: 6,
      isGuarding: false
    },
    aberration: {
      vitality: 10,
      maxVitality: 10
    },
    scene: 1
  };
  

function loadCombatScene() {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = ""; // Clear previous content

    const sceneDiv = document.createElement("div"); // Create a new div for the scene
    sceneDiv.className = "scene"; //adds a class to the div

    const title = document.createElement("h2"); // Create a title element
    title.textContent = `An Aberration Appears...` // Set the title text

    const stats = document.createElement("div");
    stats.innerHTML = `
        <p>Sanity: ${combatState.masked.sanity} / ${combatState.masked.maxSanity}</p>
        <p>Echo: ${combatState.masked.echo} / ${combatState.masked.maxEcho}</p>
        <p>Enemy Vitality: ${combatState.aberration.vitality} / ${combatState.aberration.maxVitality}</p>
        <p>Scene: ${combatState.scene}</p>
        `;


    const actions = document.createElement("div"); // Create a div for actions
    actions.className = "combat-actions"; //adds a class to the div

    const invokeLash = document.createElement("button"); // Create a button for invoking lash
    invokeLash.textContent = "Invoke Lash (2)"; // Set button text
    invokeLash.onclick = () => performInvocation("lash"); // Set button action

    const dodgeButton = document.createElement("button"); // Create a button for dodging
    dodgeButton.textContent = "Dodge (1)"; // Set button text
    dodgeButton.onclick = () => performInvocation("dodge"); // Set button action

    const composeButton = document.createElement("button"); // Create a button for composing
    composeButton.textContent = "Compose (+1)"; // Set button text
    composeButton.onclick = () => performInvocation("compose"); // Set button action

    actions.appendChild(invokeLash); // Append the button to the actions div
    actions.appendChild(dodgeButton); // Append the button to the actions div
    actions.appendChild(composeButton); // Append the button to the actions div
    sceneDiv.appendChild(title); // Append the title to the scene div
    sceneDiv.appendChild(stats); // Append the stats to the scene div
    sceneDiv.appendChild(actions); // Append the actions to the scene div
    mapContainer.appendChild(sceneDiv); // Append the scene div to the map container
}

function performInvocation(type) {
    const masked = combatState.masked; // Get the masked state from combatState
    const aberration = combatState.aberration; // Get the aberration state from combatState

    if (type === "lash"){
        if (masked.echo >= 2){
            masked.echo -= 2; // Deduct 2 from the masked echo
            aberration.vitality -= 2;
        } else {
            alert("Echo is feeling low..."); // Alert if not enough echo
            return;
        }
    }

    else if(type === "dodge") {
        if (masked.echo >= 1) {
            masked.echo -= 1;
            masked.isGuarding = true; // Set the masked state to guarding

        } else {
            alert("Echo is feeling low..."); // Alert if not enough echo
            return;
        }
    }

    else if(type === "compose") {
        masked.echo = Math.min(masked.echo + 1, masked.maxEcho); // Increase echo but not over max  
    }

    //enemy attacks if not dead
    if (aberration.vitality > 0) {
        let damage = 2; // Set damage to 2

        if(masked.isGuarding) {
            damage -= 1; // Reduce damage if guarding
        }

        masked.sanity -= damage;
        masked.isGuarding = false; // Reset guarding state
    }

    // gain 1 ech each turn up to max
    masked.echo = Math.min(masked.echo + 1, masked.maxEcho); // Increase echo but not over max

    //advance scene number
    combatState.scene++;

    //check for end of combat
    if (masked.sanity <= 0) {
        endCombat("Eradictated"); // End combat if sanity is 0
        return;
    }

    loadCombatScene(); // Load the next combat scene
}

function endCombat(result) {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = ""; // Clear previous content

    const message = document.createElement("h2"); // Create a new for the message
    message.textContent = result === "victory" ? "The Aberration is silenced..." : "Your sanity shatters...";

    mapContainer.appendChild(message); // Append the message to the map container

}