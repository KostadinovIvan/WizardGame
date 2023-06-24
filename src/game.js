let game = document.querySelector(".game");
let startScreenEl = document.querySelector(".start-screen");
let gameScreenEl = document.querySelector(".game-screen");
let fireFrames = 0;
let bugTimer = 0;
let bugRate = 20;
let gameOver = false;
let scores = 0;
let scoreCount = document.createElement("p");

startScreenEl.addEventListener("click", start);

function start() {
    startScreenEl.style.display = "none";
    gameScreenEl.style.display = "block";

    let wizardEl = document.createElement("div");
    wizardEl.classList.add("wizard");
    wizardEl.style.left = "200px"
    wizardEl.style.top = "45vh"
    let scoreBar = document.createElement("div");
    scoreBar.classList.add("scoreBar");
    scoreBar.style.left = "10px"
    scoreBar.style.top = "0px"
    scoreCount.textContent = scores;
    scoreBar.appendChild(scoreCount);

    gameScreenEl.appendChild(wizardEl);
    gameScreenEl.appendChild(scoreBar);
    startGame();

}

let wizardStats = {
    width: 120,
    height: 120,
    speed: 10,
    fireRate: 30,
    fireBallSpeed: 15,
}

let bugStats = {
    width: 100,
    height: 100,
    speed: 9,
    size: 100,
    killScores: 10,
}

let keys = {
    "KeyA": false,
    "KeyS": false,
    "KeyD": false,
    "KeyW": false,
    "Space": false,
};

function startGame() {
    window.requestAnimationFrame(gameLoop);

    document.addEventListener("keydown", (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
    });

    document.addEventListener("keyup", (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });

}

function move() {

    let wizardEl = document.querySelector(".wizard")
    let pos = wizardEl.getBoundingClientRect();

    if (keys.KeyD) {
        let viewW = document.querySelector(".game-screen").offsetWidth;
        wizardEl.style.left = Math.min(pos.left + wizardStats.speed, viewW - wizardStats.width) + "px";
    }
    if (keys.KeyA) {
        wizardEl.style.left = Math.max(pos.left - wizardStats.speed, 0) + "px";
    }
    if (keys.KeyW) {
        wizardEl.style.top = Math.max(pos.top - wizardStats.speed, 0) + "px";
    }
    if (keys.KeyS) {
        let viewH = document.querySelector(".game-screen").offsetHeight;
        wizardEl.style.top = Math.min(pos.top + wizardStats.speed, viewH - wizardStats.height) + "px";

    }
    if (keys.Space) {

        
        if (fireFrames > wizardStats.fireRate) {
            fireFrames = 0;
            fire();
        }

    } else {
        wizardEl.style.backgroundImage = "url(/graph/normal.png)";
    }

}

function fire() {
    let wizardEl = document.querySelector(".wizard");
    let pos = wizardEl.getBoundingClientRect();
    wizardEl.style.backgroundImage = "url(/graph/atack.png)";

    let fireBall = document.createElement("div");
    fireBall.classList.add("fireBall");
    fireBall.style.top = (((pos.top + wizardStats.height) - wizardStats.height + wizardStats.height * 0.4)) + "px";
    fireBall.style.left = ((pos.left + wizardStats.width) - wizardStats.width + wizardStats.width + 3) + "px";

    gameScreenEl.appendChild(fireBall);

    setTimeout(() => {
        wizardEl.style.backgroundImage = "url(/graph/normal.png)";
      }, 100);

    return fireBall;
}

function createBug() {
    let viewW = document.querySelector(".game-screen").getBoundingClientRect();
    let bug = document.createElement("div");
    bug.classList.add("bug");
    bug.style.top = (Math.random() * gameScreenEl.offsetHeight) + "px";
    bug.style.left = viewW.right - bugStats.size + "px";

    gameScreenEl.appendChild(bug);
}

function detectCollision(fireBall, bug) {
    let first = fireBall.getBoundingClientRect();
    let second = bug.getBoundingClientRect();

    let hasCollision = !(first.top +20 > second.bottom || first.bottom -20 < second.top || first.right < second.left + 40 || first.left > second.right - 40);
    return hasCollision;
}

function gameLoop() {
    let wizardEl = document.querySelector(".wizard")
    let bugs = document.querySelectorAll(".bug");
    let fireBalls = document.querySelectorAll(".fireBall");
    fireFrames++;
    bugTimer++
    move();

    if (scores % 100 === 0 && scores !== 0){
        if (wizardStats.fireRate - 1 > 3){
            wizardStats.fireRate -= 1;
        }
        if (bugRate - 1 > 2){
            bugRate -= 1;
            scores += 10;
        }
    }


    if (bugTimer > bugRate) {
        createBug();
        bugTimer = 0;
    }

    //FireBalls Move
    fireBalls.forEach(fireBall => {
        let pos = fireBall.getBoundingClientRect();
        let viewW = document.querySelector(".game-screen").offsetWidth;
        fireBall.style.left = pos.left + wizardStats.fireBallSpeed + "px"
        if (pos.left > viewW) {
            fireBall.remove();
        }

        bugs.forEach(bug => {
            if (detectCollision(bug, fireBall)) {
                bug.remove();
                fireBall.remove();
                scores += bugStats.killScores;
                scoreCount.textContent = scores;
            }
        })

    })

    //Bug Move
    bugs.forEach(a => {
        let pos = a.getBoundingClientRect();
        a.style.left = pos.left - bugStats.speed + "px"
        if (pos.left < - bugStats.size) {
            a.remove();
        }
        if (detectCollision(a, wizardEl)) {
            a.style.left = parseInt(wizardEl.style.left) + 30 + "px"
            gameOver = true;
        }
    })

    if (!gameOver) {
        window.requestAnimationFrame(gameLoop);
    } else {
        gameOver = false;
        gameScreenEl.style.backgroundColor = "#245485"
        setTimeout(() => {
            gameScreenEl.style.display = "none"
            gameOverFunc();
          }, 1000);
    }
}

function gameOverFunc() {
    let gameOverScreen = document.createElement("div");
    gameOverScreen.classList.add("game-over");

    let scoreBar = document.createElement("div");
    scoreBar.classList.add("scoreBar");
    scoreBar.style.top = "42%"
    scoreCount.textContent = `Total Scores: ${scores}`;
    scoreBar.appendChild(scoreCount);
    
    let gameOverImg = document.createElement("div");
    gameOverImg.classList.add("gameOverImg");
    gameOverImg.appendChild(scoreBar)
    gameOverScreen.appendChild(gameOverImg);

    game.appendChild(gameOverScreen);

    document.querySelectorAll(".game-screen div").forEach(a => a.remove());
    bugRate = 20
    wizardStats.fireRate = 30;

    gameOverImg.addEventListener("click", () => {
        gameOverScreen.style.display = "none"
        startScreenEl.style.display = "block";
    })
    gameScreenEl.style.backgroundColor = "skyblue"
    scores = 0;

}