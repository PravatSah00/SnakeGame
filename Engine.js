class Engine {
    constructor(spriedImg, eatSound, gameOverSound) {
        // Load sound file...
        this.eatSound = eatSound;
        this.gameOverSound = gameOverSound;

        // splite image from spried sit.....
        this.spried = this.splitSpried(spriedImg);

        // Set row and col....
        this.row = 20;
        this.col = 30;

        // Create Gamestate variable....
        this.gameState = 1;

        // Setup function for initial setup....
        this.setup();
    }

    splitSpried(spriedImg) {
        let spriedWidth = spriedImg.width / 5;
        let spriedHeight = spriedImg.height / 4;
        return {
            left_down: spriedImg.get(spriedWidth * 0, spriedHeight * 0, spriedWidth, spriedHeight),
            right_down: spriedImg.get(spriedWidth * 2, spriedHeight * 0, spriedWidth, spriedHeight),
            left_up: spriedImg.get(spriedWidth * 0, spriedHeight * 1, spriedWidth, spriedHeight),
            right_up: spriedImg.get(spriedWidth * 2, spriedHeight * 2, spriedWidth, spriedHeight),

            left_right: spriedImg.get(spriedWidth * 1, spriedHeight * 0, spriedWidth, spriedHeight),
            up_down: spriedImg.get(spriedWidth * 2, spriedHeight * 1, spriedWidth, spriedHeight),

            head_up: spriedImg.get(spriedWidth * 3, spriedHeight * 0, spriedWidth - 2, spriedHeight),
            head_down: spriedImg.get(spriedWidth * 4 + 2, spriedHeight * 1, spriedWidth, spriedHeight),
            head_left: spriedImg.get(spriedWidth * 3, spriedHeight * 1 + 2, spriedWidth, spriedHeight - 3),
            head_right: spriedImg.get(spriedWidth * 4, spriedHeight * 0, spriedWidth, spriedHeight - 2),

            tell_up: spriedImg.get(spriedWidth * 4, spriedHeight * 3, spriedWidth, spriedHeight),
            tell_down: spriedImg.get(spriedWidth * 3, spriedHeight * 2, spriedWidth, spriedHeight),
            tell_left: spriedImg.get(spriedWidth * 4, spriedHeight * 2, spriedWidth, spriedHeight),
            tell_right: spriedImg.get(spriedWidth * 3, spriedHeight * 3, spriedWidth, spriedHeight),

            food: spriedImg.get(spriedWidth * 0, spriedHeight * 3, spriedWidth, spriedHeight),
        }
    }

    setup() {
        // Set game state to before game start....
        this.gameState = 1;

        // Create snake array.....
        this.snake = [[10, 0], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5]];

        // Set the moving direction of snake to right......
        this.direction = 1;

        this.food = [-1, -1];
        this.gameOver = false;
        this.score = 0;

        this.generateFood();
    }

    generateFood() {
        let i, j;
        while (true) {
            i = Math.floor(random(2, this.row - 2));
            j = Math.floor(random(2, this.col - 2));
            let ffff = true;
            for (let [snakeI, snakeJ] of this.snake) {
                if (snakeI === i && snakeJ === j) {
                    ffff = false;
                    break;
                }
            }
            if (ffff) {
                break;
            }
        }

        this.food[0] = i;
        this.food[1] = j;
    }

    getPointDir(p1, p2) {
        let rd = p1[0] - p2[0];
        let cd = p1[1] - p2[1];

        if (cd == -1) {
            return 1;
        }
        if (rd == 1) {
            return 2;
        }
        if (cd == 1) {
            return 3;
        }
        return 4;
    }

    getTailImg() {
        switch (this.getPointDir(this.snake[0], this.snake[1])) {
            case 1:
                return this.spried.tell_left;
            case 2:
                return this.spried.tell_down;
            case 3:
                return this.spried.tell_right;
            case 4:
                return this.spried.tell_up;
        }
    }

    getBodyImg(preDir, nextDir) {
        switch (preDir) {
            case 1:
                switch (nextDir) {
                    case 1:
                        return this.spried.left_right;
                    case 2:
                        return this.spried.right_up;
                    case 4:
                        return this.spried.right_down;
                }
            case 2:
                switch (nextDir) {
                    case 1:
                        return this.spried.left_down;
                    case 2:
                        return this.spried.up_down;
                    case 3:
                        return this.spried.right_down;
                }
            case 3:
                switch (nextDir) {
                    case 2:
                        return this.spried.left_up;
                    case 3:
                        return this.spried.left_right;
                    case 4:
                        return this.spried.left_down;
                }
            case 4:
                switch (nextDir) {
                    case 1:
                        return this.spried.left_up;
                    case 3:
                        return this.spried.right_up;
                    case 4:
                        return this.spried.up_down;
                }
        }
    }

    getHeadImg(preDir) {
        switch (preDir) {
            case 1:
                return this.spried.head_right;
            case 2:
                return this.spried.head_up;
            case 3:
                return this.spried.head_left;
            case 4:
                return this.spried.head_down;
        }
    }

    drawSnake() {
        let cellWidth = width / this.col;
        let cellHeight = height / this.row;

        // Draw tail:
        image(this.getTailImg(), this.snake[0][1] * cellWidth, this.snake[0][0] * cellHeight, cellWidth, cellHeight);

        // Draw Boddy:
        let preDir = this.getPointDir(this.snake[0], this.snake[1]);
        for (let i = 1; i < this.snake.length - 1; i++) {
            let nextDir = this.getPointDir(this.snake[i], this.snake[i + 1]);
            let img = this.getBodyImg(preDir, nextDir);
            image(img, this.snake[i][1] * cellWidth, this.snake[i][0] * cellHeight, cellWidth, cellHeight);
            preDir = nextDir;
        }

        // Draw Head:
        image(this.getHeadImg(preDir), this.snake[this.snake.length - 1][1] * cellWidth, this.snake[this.snake.length - 1][0] * cellHeight, cellWidth, cellHeight);
    }

    drawBackground() {
        let row = 6;
        let col = 9;
        let boxWidth = width / col;
        let boxHeight = height / row;
        let fff = true;

        noStroke();
        background(116, 255, 150);
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (fff) {
                    fill(100, 255, 100);
                } else {
                    fill(150, 255, 100);
                }
                fff = !fff;
                rect(j * boxWidth, i * boxHeight, boxWidth, boxHeight);
            }
        }
    }

    drawFood() {
        let cellWidth = width / this.col;
        let cellHeight = height / this.row;
        image(this.spried.food, this.food[1] * cellWidth, this.food[0] * cellHeight, cellWidth, cellHeight);
    }

    draw() {
        this.drawBackground();
        this.drawFood();
        this.drawSnake();

        if (this.gameState === 1) {
            textAlign(CENTER, CENTER);
            textSize(120);
            stroke(255);
            fill(255);
            text("PRESS SPACE-BAR", 0, 0, width, height - 100);
        }

        if (this.gameOver) {
            textAlign(CENTER, CENTER);
            textSize(120);
            stroke(255);
            fill(255);
            text(`GAME OVER\nSCORE-${this.score}`, 0, 0, width, height);
        }
    }

    handleEvent() {
        if (keyIsPressed) {
            if (key === " ") {
                this.gameState = 2;
                return;
            }
            if (keyCode === LEFT_ARROW || key == 'j') {
                if (this.direction === 2 || this.direction === 4) {
                    this.direction = 3;
                }
            }
            else if (keyCode === RIGHT_ARROW || key == 'l') {
                if (this.direction === 2 || this.direction === 4) {
                    this.direction = 1;
                }
            }
            else if (keyCode === UP_ARROW || key == 'i') {
                if (this.direction === 1 || this.direction === 3) {
                    this.direction = 2;
                }
            }
            else if (keyCode === DOWN_ARROW || key == 'k') {
                if (this.direction === 1 || this.direction === 3) {
                    this.direction = 4;
                }
            }
        }
    }

    isWallHit(newHead) {
        return (newHead[0] < 0 || newHead[0] >= this.row || newHead[1] < 0 || newHead[1] >= this.col);
    }

    isFoodHit(newHead) {
        return (newHead[0] == this.food[0] && newHead[1] == this.food[1]);
    }

    update() {
        if (this.gameOver || this.gameState === 1) { return };

        // Calculate snake's new head position:
        let head = this.snake[this.snake.length - 1];
        let newHead = [...head];
        switch (this.direction) {
            case 1:
                newHead[1] = head[1] + 1;
                break;
            case 2:
                newHead[0] = head[0] - 1;
                break;
            case 3:
                newHead[1] = head[1] - 1;
                break;
            case 4:
                newHead[0] = head[0] + 1;
                break;
        }

        //Detect colusion with wall.....
        if (this.isWallHit(newHead)) {
            this.gameOverSound.play();
            this.gameOver = true;
            return;
        }

        this.snake.push(newHead);

        // Detect food is hit or not....
        if (this.isFoodHit(newHead)) {
            this.eatSound.play();
            this.score += 10;
            this.generateFood();
            return;
        }

        this.snake.shift();
    }
}