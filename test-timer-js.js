// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const DURATION = 1000;
let timeLeft = 110; // so the game will run for 110 secs
let gameTimer = null; // we will use it to run our countdown
let isGameOver = false;
let userWon = false;

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const controlBtns = document.querySelector(".control-btns");
const controlBtnsSpan = document.querySelector(".control-btns span");
const nameInput = document.querySelector(".main-container .name span");
const blockContainer = document.querySelector(".game-blocks-container");
const blocksArray = Array.from(document.querySelectorAll(".game-blocks-container .game-block"));
const triesElement = document.querySelector(".tries span");
let playAgainBtn = document.querySelectorAll(".btn-play-again");
let timerElement = document.querySelector(".timer span")
let blocksNumber = document.querySelectorAll(".blocks-number");
let wonGame = document.querySelector(".win-game");
let endGame = document.querySelector(".end-game");
let triesNumber = document.querySelectorAll(".tries-number")
let endGameMsg = document.getElementById("end-game-msg");
let winGameMsg = document.getElementById("win-game-msg");
let matchedBlocksNumber = document.getElementById("matched-blocks-number");
let remaningTime = document.getElementById("remaning-time");
// DOM ELEMENTS createad by js





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
controlBtnsSpan.addEventListener("click", () => {
    console.log("start game" , controlBtnsSpan);
    const yourName = prompt("What's your name?");
    nameInput.textContent = (yourName?.trim()) ? yourName : "Anonymous";
    controlBtns.style.display = "none";

    revealBlocks();

    // setTimeout(() => {
    //     startTimer(); // this the function that will start the count down
    // }, DURATION)
});

// ==========================================
// 4. the timer function
// ==========================================

function startTimer() {
    // Clear any existing timer before starting a new one to prevent stacking
    clearInterval(gameTimer);
    gameTimer = setInterval(tick, 1000);
};

function tick() {
    timeLeft--;
    console.log("the time left is: ", timeLeft);

    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        stopCount();
    }
}

function stopCount() {
    isGameOver = true;
    clearInterval(gameTimer);

    triesNumber.forEach((span) => {
    span.textContent = triesElement.textContent;
    })

    blocksNumber.forEach((block) => {
        block.textContent = blocksArray.length;
    })

    remaningTime.textContent = timerElement.textContent;

    if (userWon) {
        console.log("you won");
        wonGame.style.display = "flex";
        return;
    } else {
        console.log("game over");
        matchedBlocksNumber.textContent = blocksArray.filter(block => block.classList.contains("matched")).length;
        endGame.style.display = "flex";
    }
}


// ==========================================
// 4. GAME LOGIC FUNCTIONS
// ==========================================
function flipBlock(selectedBlock) {
    // prevent flipping any blocks when the game is over
    if (isGameOver) {
        return;
    }
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

    if(blocksArray.filter(block => block.classList.contains("matched")).length === blocksArray.length) {
        userWon = true;
        stopCount();
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

playAgainBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        timeLeft = 110;
        timerElement.textContent = timeLeft;
        // Do not call startTimer() here, 
        // let the "Start Game" button overlay handle it.
        isGameOver = false;
        userWon = false;
        triesElement.textContent = 0;
        wonGame.style.display = "none";
        endGame.style.display = "none";
        controlBtns.style.display = "flex";

        blocksArray.forEach((block) => {
            block.classList.remove("matched");
            block.classList.remove("flipped");
        })

        resetGame();
    })
})

function resetGame() {
    // Shuffle the order range first
    shuffle(orderRange);
    
    //  Assign the new shuffled order to the blocks
    blocksArray.forEach((block, index) => {
        block.style.order = orderRange[index];
    });
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


function revealBlocks() {
    blocksArray.forEach((block) => {
        block.classList.add("flipped");
    })
    blockContainer.classList.add("no-clicking")
    setTimeout(() => {
        blocksArray.forEach((block) => {
            block.classList.remove("flipped");
            blockContainer.classList.remove("no-clicking");
            startTimer();
        })
    }, 2000)
}


function playSound(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0; // Rewind to start in case it's clicked rapidly
    audioElement.play().catch(err => console.log("Audio playback interrupted:", err));
}