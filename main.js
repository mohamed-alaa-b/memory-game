// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const DURATION = 1000;

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const controlBtns = document.querySelector(".control-btns");
const controlBtnsSpan = document.querySelector(".control-btns span");
const nameInput = document.querySelector(".main-container .name span");
const blockContainer = document.querySelector(".game-blocks-container");
const blocksArray = Array.from(document.querySelectorAll(".game-blocks-container .game-block"));
const triesElement = document.querySelector(".tries span");

// Audio Elements
const successSound = document.getElementById("success");
const failSound = document.getElementById("fail");

// ==========================================
// 3. INITIALIZATION & EVENTS
// ==========================================
// Setup game board order
const orderRange = [...Array(blocksArray.length).keys()];
shuffle(orderRange);

blocksArray.forEach((block, index) => {
    block.style.order = orderRange[index];
    block.addEventListener("click", () => flipBlock(block));
});

// Start Game Button Click
controlBtnsSpan.onclick = function() {
    const yourName = prompt("What's your name?");
    nameInput.textContent = (yourName?.trim()) ? yourName : "Anonymous";
    controlBtns.style.display = "none";
};

// ==========================================
// 4. GAME LOGIC FUNCTIONS
// ==========================================
function flipBlock(selectedBlock) {
    // Prevent flipping already matched blocks or the same block twice
    if (selectedBlock.classList.contains("flipped") || selectedBlock.classList.contains("matched")) {
        return;
    }

    selectedBlock.classList.add("flipped");

    const allFlippedBlocks = blocksArray.filter(block => block.classList.contains("flipped"));
    
    if (allFlippedBlocks.length === 2) {
        stopClicking();
        checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
    }
}

function stopClicking() {
    blockContainer.classList.add("no-clicking");
    setTimeout(() => {
        blockContainer.classList.remove("no-clicking");
    }, DURATION);
}

function checkMatchedBlocks(firstBlock, secondBlock) {
    if (firstBlock.dataset.animals === secondBlock.dataset.animals) {
        // Handle Match
        firstBlock.classList.replace("flipped", "matched");
        secondBlock.classList.replace("flipped", "matched");
        
        playSound(successSound);
    } else {
        // Handle Mis-match
        triesElement.textContent = parseInt(triesElement.textContent) + 1;
        playSound(failSound);

        setTimeout(() => {
            firstBlock.classList.remove("flipped");
            secondBlock.classList.remove("flipped");
        }, DURATION);
    }
}

// ==========================================
// 5. UTILITY FUNCTIONS
// ==========================================
function shuffle(array) {
    let current = array.length;
    while (current > 0) {
        let random = Math.floor(Math.random() * current);
        current--;
        // Modern ES6 destructuring swap (cleaner than using a 'temp' variable)
        [array[current], array[random]] = [array[random], array[current]];
    }
    return array;
}

function playSound(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0; // Rewind to start in case it's clicked rapidly
    audioElement.play().catch(err => console.log("Audio playback interrupted:", err));
}