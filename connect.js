


document.addEventListener("DOMContentLoaded", () => {
    const rows = 6;
    const cols = 7;
    let currentPlayer = "red"; // Tracks the current player: "red" or "yellow"
    let board = []; // Represents the game board
    let gameActive = true; // Indicates if the game is active
    let difficulty = "easy"; // Difficulty level: "easy", "medium", or "hard"
    let score = 0; // Initialize the score

    // Screen elements
    const splashScreen = document.getElementById('splash-screen');
    const difficultyScreen = document.getElementById('difficulty-screen');
    const gameScreen = document.getElementById('game-screen');

    // Game Elements
    const boardElement = document.getElementById("board");
    const resetButton = document.getElementById("reset-button");
    const statusElement = document.getElementById("status");
    const difficultySelect = document.getElementById("difficulty");
    const startGameButton = document.getElementById("start-game");
    const scoreElement = document.getElementById("score"); // Element to display the score

    // Handle screen transitions
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
        if (screen === difficultyScreen) {
            updateScoreDisplay(); // Update the score display when showing the difficulty screen
        }
    }

    // Show splash screen and transition to difficulty screen after 2 seconds
    setTimeout(() => {
        showScreen(difficultyScreen);
    }, 2000);

    // Start the game based on the selected difficulty
    startGameButton.addEventListener('click', () => {
        difficulty = difficultySelect.value;
        showScreen(gameScreen);
        initBoard();
    });

    // Reset game and return to difficulty screen
    resetButton.addEventListener("click", () => {
        gameActive = true;
        currentPlayer = "red";
        showScreen(difficultyScreen); // Return to the difficulty screen on reset
    });

    // Update the difficulty level when changed
    difficultySelect.addEventListener("change", () => {
        difficulty = difficultySelect.value;
    });

    // Initialize the game board
    function initBoard() {
        board = Array(rows).fill(null).map(() => Array(cols).fill(null));
        boardElement.innerHTML = "";
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", handleCellClick);
                boardElement.appendChild(cell);
            }
        }
        statusElement.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
    }

    // Handle cell click event
    function handleCellClick(e) {
        if (!gameActive) return;

        const col = parseInt(e.target.dataset.col);
        const row = getAvailableRow(col);

        if (row === null) return;

        placePiece(col, currentPlayer);

        if (checkWin(currentPlayer)) {
            statusElement.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
            gameActive = false;
            updateScore(currentPlayer === "red"); // Update score based on win/lose
            setTimeout(() => showScreen(difficultyScreen), 2000); // Show difficulty screen after 2 seconds
        } else if (isBoardFull()) {
            statusElement.textContent = "It's a tie!";
            gameActive = false;
            setTimeout(() => showScreen(difficultyScreen), 2000); // Show difficulty screen after 2 seconds
        } else {
            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
            if (currentPlayer === "yellow") {
                statusElement.textContent = "AI's turn...";
                setTimeout(aiMove, 500); // Small delay for AI move
            } else {
                statusElement.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
            }
        }
    }

    // Update score based on game result
    function updateScore(playerWon) {
        if (playerWon) {
            if (difficulty === "easy") {
                score += 50;
            } else if (difficulty === "medium") {
                score += 100;
            } else if (difficulty === "hard") {
                score += 200;
            }
        } else {
            score -= 20; // Deduct 20 points if AI wins
        }
        updateScoreDisplay();
    }

    // Update the score display on the screen
    function updateScoreDisplay() {
        scoreElement.textContent = `Score: ${score}`;
    }

    // Get the lowest available row in the selected column
    function getAvailableRow(col) {
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                return row;
            }
        }
        return null;
    }

    // Update the board display
    function updateBoard() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                cell.classList.remove("red", "yellow");
                if (board[row][col]) {
                    cell.classList.add(board[row][col]);
                }
            }
        }
    }

    // Check if the current player has won
    function checkWin(player) {
        return checkHorizontal(player) || checkVertical(player) || checkDiagonal(player);
    }

    // Check horizontal win condition
    function checkHorizontal(player) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols - 3; col++) {
                if (board[row][col] === player &&
                    board[row][col + 1] === player &&
                    board[row][col + 2] === player &&
                    board[row][col + 3] === player) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check vertical win condition
    function checkVertical(player) {
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows - 3; row++) {
                if (board[row][col] === player &&
                    board[row + 1][col] === player &&
                    board[row + 2][col] === player &&
                    board[row + 3][col] === player) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check diagonal win condition (both ascending and descending)
    function checkDiagonal(player) {
        // Check ascending diagonal
        for (let row = 3; row < rows; row++) {
            for (let col = 0; col < cols - 3; col++) {
                if (board[row][col] === player &&
                    board[row - 1][col + 1] === player &&
                    board[row - 2][col + 2] === player &&
                    board[row - 3][col + 3] === player) {
                    return true;
                }
            }
        }
        // Check descending diagonal
        for (let row = 0; row < rows - 3; row++) {
            for (let col = 0; col < cols - 3; col++) {
                if (board[row][col] === player &&
                    board[row + 1][col + 1] === player &&
                    board[row + 2][col + 2] === player &&
                    board[row + 3][col + 3] === player) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if the board is full
    function isBoardFull() {
        return board.every(row => row.every(cell => cell));
    }

    // Make a move for the AI based on difficulty
    function aiMove() {
        if (!gameActive) return;

        let col;

        switch (difficulty) {
            case "easy":
                // Easy: Random valid column
                do {
                    col = Math.floor(Math.random() * cols);
                } while (getAvailableRow(col) === null);
                break;
            
            case "medium":
                // Medium: Block player and make stronger moves
                col = findBlockingMove() || findCentralMove() || findRandomMove();
                break;
            
            case "hard":
                // Hard: Prioritize winning, then blocking, then central columns
                col = findWinningMove() || findBlockingMove() || findCentralMove() || findRandomMove();
                break;
        }

        const row = getAvailableRow(col);
        placePiece(col, currentPlayer);

        if (checkWin(currentPlayer)) {
            statusElement.textContent = `AI (Player ${currentPlayer.toUpperCase()}) wins!`;
            gameActive = false;
            updateScore(false); // Update score based on loss
            setTimeout(() => showScreen(difficultyScreen), 2000); // Show difficulty screen after 2 seconds
        } else {
            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
            statusElement.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
        }
    }

    // Find a random valid column for the AI to play
    function findRandomMove() {
        let col;
        do {
            col = Math.floor(Math.random() * cols);
        } while (getAvailableRow(col) === null);
        return col;
    }

    // Find a column that blocks the player's win
    function findBlockingMove() {
        for (let col = 0; col < cols; col++) {
            const row = getAvailableRow(col);
            if (row !== null) {
                board[row][col] = "red"; // Temporarily place opponent's piece
                if (checkWin("red")) {
                    board[row][col] = null; // Undo the temporary move
                    return col; // Block this move
                }
                board[row][col] = null; // Undo the temporary move
            }
        }
        return null;
    }

    // Place a piece in the specified column and apply visual effects
    function placePiece(column, playerColor) {
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][column]) {
                board[row][column] = playerColor;
                const cell = document.querySelector(`#board .cell[data-row='${row}'][data-col='${column}']`);
                
                // Apply the color class before starting the animation
                cell.classList.add(playerColor);
                
                // Add a small delay before applying the dropping class to ensure color is set
                setTimeout(() => {
                    cell.classList.add('dropping');
                }, 0);

                // Listen for the end of the animation
                cell.addEventListener('animationend', function() {
                    cell.classList.remove('dropping');  // Remove the temporary class
                    // The color and shadow should remain correctly applied
                }, { once: true });

                return true;
            }
        }
        return false;
    }

    // Find a winning move for the AI
    function findWinningMove() {
        for (let col = 0; col < cols; col++) {
            const row = getAvailableRow(col);
            if (row !== null) {
                board[row][col] = "yellow"; // Temporarily place AI's piece
                if (checkWin("yellow")) {
                    board[row][col] = null; // Undo the temporary move
                    return col; // Win the game
                }
                board[row][col] = null; // Undo the temporary move
            }
        }
        return null;
    }

    // Find a column in the center to favor for better board control
    function findCentralMove() {
        const preferredColumns = [3, 2, 4, 1, 5, 0, 6]; // Favor the middle columns first
        for (const col of preferredColumns) {
            if (getAvailableRow(col) !== null) {
                return col;
            }
        }
        return null;
    }

    // Show the splash screen initially
    showScreen(splashScreen);

    // Initialize the game board
    initBoard();
});
