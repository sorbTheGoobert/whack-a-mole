const game = document.getElementById("display");
const ctx = game.getContext("2d");
const bg_img = document.getElementById("bg_img");
let point = 0;
let life = 5;
let frame;
let paused = 1 // 1 unpuased, -1 paused
let gameLost = false;
let firstInput = true;

// spawning

class Nuts {
    constructor() {
        this.xPos;
        this.yPos;
        this.height;
        this.width;
        this.clicked = false;
        this.sprite = document.getElementById("nut_webp");
        this.avaivable_frames = 5 * 60;
        this.frame_counter = this.avaivable_frames;
    }
    draw = () => {
        ctx.drawImage(this.sprite, this.xPos, this.yPos, this.width, this.height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.xPos, this.yPos, this.width, this.height);
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(Math.round(this.frame_counter / 60), this.xPos + this.width / 2, this.yPos + this.height / 2);
    }
    randomize = () => {
        this.frame_counter = this.avaivable_frames;
        this.width = Math.floor(Math.random() * 51) + 50;
        this.height = Math.floor(Math.random() * 51) + 50;
        this.xPos = Math.floor(Math.random() * 1181);
        this.yPos = Math.floor(Math.random() * 861);
    }
    update = () => {
        if (this.clicked) {
            point++;
            this.randomize();
            this.clicked = false;
            return null;
        }

        if (this.frame_counter == 0) {
            life--;
            this.randomize();
            return null;
        }

        this.frame_counter--;
        this.draw();
        return null;
    }
}

const mouse = {
    xPos: undefined,
    yPos: undefined,
}

game.addEventListener("mousemove", (event) => {
    mouse.xPos = event.offsetX;
    mouse.yPos = event.offsetY;
    if (mouse.xPos < 0) {
        mouse.xPos = 0;
    } else if (mouse.xPos > 1280) {
        mouse.xPos = 1280;
    }
    if (mouse.yPos < 0) {
        mouse.yPos = 0;
    } else if (mouse.yPos > 1280) {
        mouse.yPos = 1280;
    }
})

function checkIfHit() {
    for (i = 0; i < nuts.length; i++) {
        if (
            mouse.xPos >= nuts[i].xPos &&
            mouse.xPos <= nuts[i].xPos + nuts[i].width &&
            mouse.yPos >= nuts[i].yPos &&
            mouse.yPos <= nuts[i].yPos + nuts[i].height
        ) {
            return nuts[i];
        }
    }
    return null;
}

window.addEventListener("mousedown", () => {
    if(gameLost){
        gameLost = false;
        init();
    }
    if(paused == 1){
        if (firstInput) {
            frame = setInterval(update, 1000 / 60);
            firstInput = false;
        }
        if (checkIfHit()) {
            checkIfHit().clicked = true;
        }
        return null;
    }
})
window.addEventListener("keydown", (event) => {
    if (gameLost) {
        gameLost = false;
        init();
    }
    if (event.code === "Escape") {
        paused *= -1;
        return null;
    }
    if(paused == 1){ 
        if (firstInput) {
            frame = setInterval(update, 1000 / 60);
            firstInput = false;
        }
        if (checkIfHit()) {
            checkIfHit().clicked = true;
        }
        return null;
    }
})

const nuts = [new Nuts()];
let requirement = 10;

function drawGUI(){
    ctx.font = "32px Arial"
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillText(`Points: ${point}`, 640, 20);
    ctx.fillText(`Lives: ${life}`, 640, 80);
}

function redrawBG() {
    ctx.clearRect(0, 0, 1280, 960);
    ctx.drawImage(bg_img, 0, 0, 1280, 960);
}

function drawPausedScreen(){
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, 1280, 960);
    ctx.font = "100px Comic Neue"
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillText("paused", 640, 480);
}

function displayGameOver() {
    ctx.font = "100px Arial"
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillText("YOU LOST", 640, 480);
}

function init() {
    point = 0;
    life = 5;
    redrawBG();
    drawGUI()
    for (i = 0; i < nuts.length; i++) {
        nuts[i].randomize();
        nuts[i].update();
    }
}

function update() {
    if(paused == 1 && !gameLost){
        redrawBG();
        drawGUI();
        if (point == requirement) {
            nuts.push(new Nuts());
            nuts[nuts.length - 1].randomize();
            requirement *= 2;
        }
        for (i = 0; i < nuts.length; i++) {
            nuts[i].update();
        }
        if(life == 0){
            gameLost = true;
        }
    }else if(paused == -1 && !gameLost){
        redrawBG();
        drawGUI();
        for (i = 0; i < nuts.length; i++) {
            nuts[i].draw();
        }
        drawPausedScreen();
    }else if(gameLost){
        redrawBG();
        drawGUI();
        for (i = 0; i < nuts.length; i++) {
            nuts[i].draw();
        }
        displayGameOver();
        clearInterval(frame);
    }
}

window.onload = init();
