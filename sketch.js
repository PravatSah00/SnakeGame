let spriedImg = null;
let eatSound = null;
let gameoverSound = null;
let engine = null;

function preload() {
    try {
        spriedImg = loadImage("./Media/image/snake-spried.png");
        spriedImg.resize(1280, 1024);
    }
    catch (err) {
        console.log("Error on load image.");
    }

    try {
        eatSound = loadSound('./Media/sound/eat-sound.mp3',);
        gameoverSound = loadSound("./Media/sound/game-over.mp3");
    }
    catch (err) {
        console.log("Error on load sound file.")
    }
}

function setup() {
    createCanvas(1200, 700);
    engine = new Engine(spriedImg, eatSound, gameoverSound);
    frameRate(10);
}

function draw() {
    engine.draw();
    engine.handleEvent();
    engine.update();
}