// THIS IS THE COMPLETE, CORRECTED CODE FOR sorting_game.js

// --- DOM Elements ---
const sortingConveyorBelt = document.querySelector('.conveyor-belt');
const sortingCorrectSortsElement = document.getElementById('correct-sorts');
const sortingComboCounterElement = document.getElementById('combo-counter');
const sortingScoreElement = document.getElementById('score');
const sortingSpeedDisplayElement = document.getElementById('speed-display');
const sortingRestartBtn = document.getElementById('restart-btn');

// --- Game state for sorting ---
let sortingGameState = {
    correctSorts: 0,
    combo: 0,
    score: 0,
    speed: 1.0,
    items: [],
    itemIntervals: [],
    isGameActive: false // Start as false
};
let itemsToGenerateList = [];
let totalMaterialsToSort = 0;
let sortedMaterialsCount = { metal: 0, plastic: 0, glass: 0, hazardous: 0, electronics: 0 };


// 1. This is the NEW "START" function called by base.js
// REPLACE your old startSortingGame function with this one

function startSortingGame(materials) {
    // materials = { metal: 5, plastic: 4, circuit: 3 }

    // Reset counts and UI
    initSortingGame(); // This is your old initGame, but renamed
    sortedMaterialsCount = { metal: 0, plastic: 0, glass: 0, hazardous: 0, electronics: 0 };
    itemsToGenerateList = [];
    sortingGameState.isGameActive = true;

    // Create the list of items to spawn from the inventory
    for (let i = 0; i < materials.metal; i++) {
        itemsToGenerateList.push({ 
            type: 'metal', 
            name: 'Metal Scrap', 
            image: images.rock1, // <-- Use the preloaded image
            color: '#f39c12' 
        });
    }
    for (let i = 0; i < materials.plastic; i++) {
        itemsToGenerateList.push({ 
            type: 'plastic', 
            name: 'Plastic Part', 
            image: images.liquidificador, // <-- Use the preloaded image
            color: '#3498db' 
        });
    }
    for (let i = 0; i < (materials.circuit || 0); i++) {
        itemsToGenerateList.push({ 
            type: 'electronics', 
            name: 'Circuit Board', 
            image: images.chip, // <-- Use the preloaded image
            color: '#9b59b6' 
        });
    }

    // Shuffle the items
    itemsToGenerateList.sort(() => 0.5 - Math.random());
    
    totalMaterialsToSort = itemsToGenerateList.length;
    
    // Update the "Correct: 0/15" display
    if (sortingCorrectSortsElement) {
        sortingCorrectSortsElement.textContent = `0/${totalMaterialsToSort}`;
    }
    if (totalMaterialsToSort === 0) {
    console.log("No materials to sort, skipping to phone building.");
    // Call endSortingGame, which will trigger the transition
    setTimeout(endSortingGame, 500); // Short delay so it's not instant
    return; // Don't start item generation
}
// -

    // Start spawning items from our new list
    startItemGeneration();
}

// 2. This is the old 'resetGame', but renamed and using the correct state
function initSortingGame() {
    // Clear any existing items and intervals
    if (sortingGameState.items) {
        sortingGameState.items.forEach(item => item.remove());
    }
    if (sortingGameState.itemIntervals) {
        sortingGameState.itemIntervals.forEach(interval => clearInterval(interval));
    }
   
    // Reset game state
    sortingGameState.correctSorts = 0;
    sortingGameState.combo = 0;
    sortingGameState.score = 0;
    sortingGameState.speed = 1.0;
    sortingGameState.items = [];
    sortingGameState.itemIntervals = [];
    sortingGameState.isGameActive = false;
   
    // Update UI
    sortingCorrectSortsElement.textContent = '0';
    sortingComboCounterElement.textContent = '0';
    sortingScoreElement.textContent = '0';
    sortingSpeedDisplayElement.textContent = '1.0';

    setupBins();
}

// 3. Set up bin event listeners
function setupBins() {
    const bins = document.querySelectorAll('.bin');
    bins.forEach(bin => {
        bin.addEventListener('dragover', (e) => e.preventDefault());
        bin.addEventListener('drop', (e) => handleDrop(e, bin.dataset.type));
    });
}

// 4. Start generating items from the list
function startItemGeneration() {
    if (itemsToGenerateList.length > 0) {
        generateSortingItem();
    }
    
    const generationInterval = setInterval(() => {
        if (sortingGameState.isGameActive && itemsToGenerateList.length > 0) {
            generateSortingItem();
        } else if (itemsToGenerateList.length === 0) {
            clearInterval(generationInterval);
        }
    }, 2000 / sortingGameState.speed);
}

// 5. Generate a sorting item
// REPLACE your old generateSortingItem function with this one

function generateSortingItem() {
    if (!sortingGameState.isGameActive || itemsToGenerateList.length === 0) {
        return;
    }
    
    const itemData = itemsToGenerateList.shift();
    const item = document.createElement('div');
    item.className = `sorting-item ${itemData.type}`;
    item.draggable = true;
    item.dataset.type = itemData.type;
    item.style.backgroundColor = itemData.color;
    item.style.left = '-60px';

    // --- THIS IS THE NEW PART ---
    item.innerHTML = ''; // Clear any default text
    if (itemData.image && itemData.image.src) {
        const imgEl = document.createElement('img');
        imgEl.src = itemData.image.src;
        imgEl.style.width = '90%';
        imgEl.style.height = '90%';
        imgEl.style.objectFit = 'contain';
        imgEl.draggable = false; // Prevents dragging the image instead of the box
        item.appendChild(imgEl);
    } else {
        // Fallback if image is missing (e.g., 'glass')
        item.innerHTML = '❓'; 
    }
    // --- END OF NEW PART ---
   
    item.addEventListener('dragstart', (e) => {
        if (!sortingGameState.isGameActive) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('text/plain', itemData.type);
        item.style.opacity = '0.7';
    });
   
    item.addEventListener('dragend', () => {
        item.style.opacity = '1';
    });
   
    sortingConveyorBelt.appendChild(item);
    sortingGameState.items.push(item);
   
    let position = -60;
    const moveInterval = setInterval(() => {
        if (!sortingGameState.isGameActive) {
            clearInterval(moveInterval);
            return;
        }
       
        position += sortingGameState.speed;
        item.style.left = position + 'px';
       
        if (position > sortingConveyorBelt.clientWidth + 60) {
            clearInterval(moveInterval);
            item.remove();
           
            const index = sortingGameState.items.indexOf(item);
            if (index > -1) {
                sortingGameState.items.splice(index, 1);
            }
           
            if (sortingGameState.combo > 0) {
                sortingGameState.combo = 0;
                sortingComboCounterElement.textContent = '0';
                showComboFeedback("Missed! Combo reset");
            }
            
            // Check if that was the last item
            if (itemsToGenerateList.length === 0 && sortingGameState.items.length === 0) {
                endSortingGame();
            }
        }
    }, 16); // ~60fps
   
    sortingGameState.itemIntervals.push(moveInterval);
   
    if (sortingGameState.speed < 3.0) {
        sortingGameState.speed += 0.02;
        sortingSpeedDisplayElement.textContent = sortingGameState.speed.toFixed(1);
    }
}

// 6. Handle dropping an item into a bin
function handleDrop(e, binType) {
    e.preventDefault();
    if (!sortingGameState.isGameActive) return;
   
    const itemType = e.dataTransfer.getData('text/plain');
    const draggedItem = sortingGameState.items.find(item => item.style.opacity === '0.7');
   
    if (itemType === binType) {
        // Correct sort
        sortingGameState.correctSorts++;
        sortingGameState.combo++;
        sortingGameState.score += 10 + (sortingGameState.combo * 2);
       
        sortingCorrectSortsElement.textContent = `${sortingGameState.correctSorts}/${totalMaterialsToSort}`;
        sortingComboCounterElement.textContent = sortingGameState.combo;
        sortingScoreElement.textContent = sortingGameState.score;
       
        if (sortedMaterialsCount.hasOwnProperty(itemType)) {
            sortedMaterialsCount[itemType]++;
        }
        
        showComboFeedback(`Correct! +${10 + (sortingGameState.combo * 2)} points`);
       
        if (draggedItem) {
            draggedItem.remove();
            const index = sortingGameState.items.indexOf(draggedItem);
            if (index > -1) {
                sortingGameState.items.splice(index, 1);
            }
        }
       
        // Check if game is complete
        if (sortingGameState.correctSorts >= totalMaterialsToSort) {
            endSortingGame();
        }
    } else {
        // Incorrect sort
        sortingGameState.combo = 0;
        sortingGameState.score = Math.max(0, sortingGameState.score - 5);
        sortingComboCounterElement.textContent = '0';
        sortingScoreElement.textContent = sortingGameState.score;
        showComboFeedback("Wrong bin! -5 points");
    }
}

// 7. Show combo feedback
function showComboFeedback(message) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'absolute';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    feedback.style.color = 'white';
    feedback.style.padding = '10px 20px';
    feedback.style.borderRadius = '10px';
    feedback.style.zIndex = '100';
    feedback.style.fontSize = '1.2rem';
    feedback.style.fontWeight = 'bold';
   
    document.body.appendChild(feedback);
   
    setTimeout(() => {
        feedback.remove();
    }, 1500);
}

// 8. End the sorting game
function endSortingGame() {
    sortingGameState.isGameActive = false;
    sortingGameState.itemIntervals.forEach(interval => clearInterval(interval));
    
    // Hide the sorting game
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        gameContainer.style.display = "none";
    }

    // Show the canvas again for the final phase
    const canvas = document.getElementById("canvas");
    if (canvas) {
        canvas.style.display = "block";
    }
    
    // Call the final function IN base.js
    startPhoneBuildingSequence(sortedMaterialsCount);
}

// --- Event Listeners ---
// The restart button will just re-launch the init function
// (It won't work perfectly without re-running phase 1, but it's good for testing)
if (sortingRestartBtn) {
    sortingRestartBtn.addEventListener('click', () => {
        // To restart, we'd need the materials again.
        // For now, just re-init the empty state.
        resetTimer();
        gameStage = "stage1"
        initSortingGame();
        alert("Restarting empty state. To play properly, restart from Phase 1.");
    });
}

// Run setup once
setupBins();