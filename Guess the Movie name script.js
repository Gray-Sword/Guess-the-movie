const movies = [
    { emoji: "🦁👑", title: "The Lion King", difficulty: "easy" },
    { emoji: "🚢💔", title: "Titanic", difficulty: "easy" },
    { emoji: "🧊👸", title: "Frozen", difficulty: "easy" },
    { emoji: "🐜👨", title: "Ant Man", difficulty: "easy" },
    { emoji: "🐴", title: "Spirit", difficulty: "easy" },
    { emoji: "🐨🦍🐘🎤", title: "Sing", difficulty: "easy" },
    { emoji: "🥋🐼", title: "Kung Fu Panda", difficulty: "easy" },
    { emoji: "🐭👨‍🍳", title: "Ratatouille", difficulty: "easy" },
    { emoji: "💀🎻", title: "Coco", difficulty: "easy" },
    { emoji: "🧙‍♂️💍", title: "Lord of the Rings", difficulty: "medium" },
    { emoji: "🐻👸🏹", title: "Brave", difficulty: "medium" },
    { emoji: "🦖🌴", title: "Jurassic Park", difficulty: "medium" },
    { emoji: "⚡🤓🧹", title: "Harry Potter", difficulty: "medium" },
    { emoji: "👻👻", title: "Ghostbusters", difficulty: "hard" },
    { emoji: "🥊👨🏿", title: "Creed", difficulty: "hard" },
    { emoji: "🤖", title: "Robots", difficulty: "hard" },
    { emoji: "👦🕒", title: "Hugo", difficulty: "hard" },
    { emoji: "🧑🏽🐯⛵", title: "Life of Pi", difficulty: "hard" },
    { emoji: "🤥", title: "Pinocchio", difficulty: "hard" },
    { emoji: "🎭👻", title: "Phantom of the Opera", difficulty: "hell" },
    { emoji: "🤖❤️", title: "Wall E", difficulty: "hell" },
    { emoji: "👩⏮🐲", title: "Raya And The Last Dragon", difficulty: "hell" }
];

let currentMovie;
let triesLeft = 5;
let guessedLetters = [];
let correctLetters = [];
let score = 0;
let hintUsed = false;
let usedMovies = new Set();

function getRandomUnusedMovie() {
    const availableMovies = movies.filter(movie => !usedMovies.has(movie.title));
    if (availableMovies.length === 0) {
        usedMovies.clear(); // Reset if all movies have been used
        return movies[Math.floor(Math.random() * movies.length)];
    }
    return availableMovies[Math.floor(Math.random() * availableMovies.length)];
}

function startNewLevel() {
    currentMovie = getRandomUnusedMovie();
    usedMovies.add(currentMovie.title);
    triesLeft = 5;
    guessedLetters = [];
    correctLetters = [];
    hintUsed = false;
    
    document.getElementById("tries-left").innerText = triesLeft;
    document.getElementById("emoji-display").innerText = currentMovie.emoji;
    document.getElementById("message").innerText = "";
    document.getElementById("score").innerText = score;
    document.getElementById("current-difficulty").innerText = currentMovie.difficulty.charAt(0).toUpperCase() + currentMovie.difficulty.slice(1);
    document.getElementById("try-again-button").style.display = "none";
    document.getElementById("game-over-message").classList.add("hidden");
    document.getElementById("keyboard").style.opacity = "1";
    
    updateMovieNameLine();
    generateKeyboard();
}

function updateMovieNameLine() {
    const movieNameContainer = document.getElementById("movie-name");
    movieNameContainer.innerHTML = "";
    
    for (const char of currentMovie.title) {
        const span = document.createElement("span");
        if (char === " ") {
            span.textContent = " ";
            span.style.border = "none";
        } else {
            span.textContent = correctLetters.includes(char.toLowerCase()) ? char : "_";
        }
        movieNameContainer.appendChild(span);
    }
}

function generateKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";
    
    for (const char of "abcdefghijklmnopqrstuvwxyz") {
        const button = document.createElement("button");
        button.textContent = char.toUpperCase();
        button.onclick = () => handleGuess(char, button);
        button.classList.add('keyboard-button');
        keyboard.appendChild(button);
    }
}

function handleGuess(letter, button) {
    if (triesLeft <= 0) return;

    button.style.opacity = "0";
    button.style.transform = "scale(0.8)";
    setTimeout(() => {
        button.style.display = "none";
    }, 300);

    if (!currentMovie.title.toLowerCase().includes(letter)) {
        triesLeft--;
        document.getElementById("tries-left").textContent = triesLeft;
        
        if (triesLeft <= 0) {
            gameOver();
        }
        return;
    }

    correctLetters.push(letter);
    updateMovieNameLine();

    const uniqueLetters = new Set(currentMovie.title.toLowerCase().replace(/\s/g, ""));
    const correctUniqueLetters = new Set(correctLetters);
    
    if (Array.from(uniqueLetters).every(letter => correctUniqueLetters.has(letter))) {
        const difficultyBonus = {
            "easy": 1,
            "medium": 1.5,
            "hard": 2,
            "hell": 3
        };
        score += Math.floor(triesLeft * 20 * difficultyBonus[currentMovie.difficulty]);
        document.getElementById("score").textContent = score;
        document.getElementById("message").textContent = "You Win! 🎉";
        setTimeout(startNewLevel, 2000);
    }
}

function gameOver() {
    const messageEl = document.getElementById("message");
    messageEl.innerHTML = `Game Over! The movie was:<br>"${currentMovie.title}"`;
    messageEl.classList.add("game-over");
    
    document.getElementById("game-over-message").classList.remove("hidden");
    document.getElementById("try-again-button").style.display = "inline-block";
    document.getElementById("keyboard").style.opacity = "0.5";
}

document.getElementById("hint-button").onclick = () => {
    if (score < 200) {
        alert("Not enough points for a hint!");
        return;
    }
    
    const unguessedLetters = Array.from(currentMovie.title.toLowerCase())
        .filter(char => char !== " " && !correctLetters.includes(char));
    
    if (unguessedLetters.length > 0) {
        const hintLetter = unguessedLetters[0];
        correctLetters.push(hintLetter);
        score -= 200;
        document.getElementById("score").textContent = score;
        updateMovieNameLine();
        
        const buttons = document.querySelectorAll("#keyboard button");
        buttons.forEach(button => {
            if (button.textContent.toLowerCase() === hintLetter) {
                button.style.opacity = "0";
                button.style.transform = "scale(0.8)";
                setTimeout(() => {
                    button.style.display = "none";
                }, 300);
            }
        });
    }
};

document.getElementById("try-again-button").onclick = startNewLevel;

startNewLevel();
