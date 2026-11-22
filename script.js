
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".center");
const themeToggle = document.getElementById("themeToggle");
const userInfo = document.getElementById("userInfo");
const startButton = document.getElementById("start");
const quizArea = document.getElementById("quizArea");
const topicCards = document.querySelectorAll(".topic-card");

let userName = localStorage.getItem("quizoraUser") || "Guest";
let currentTopic = "";
let currentQuestions = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

userInfo.textContent = "Edit 👤";

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".center a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

userInfo.addEventListener("click", function () {
    let name = prompt("Enter your name:", userName);

    if (name !== null && name.trim() !== "") {
        userName = name.trim();
        localStorage.setItem("quizoraUser", userName);
        alert("Welcome, " + userName + "!");
    }
});

const savedTheme = localStorage.getItem("quizoraTheme");

function setTheme(theme) {
    if (theme === "dark") {
        document.documentElement.style.setProperty("--bg-primary", "#241638");
        document.documentElement.style.setProperty("--bg-secondary", "#352344");
        document.documentElement.style.setProperty("--card-bg", "#3B245C");
        document.documentElement.style.setProperty("--text-primary", "#FFFFFF");
        document.documentElement.style.setProperty("--text-secondary", "#CDB4DB");
        document.documentElement.style.setProperty("--deep-purple", "#160D24");
        document.documentElement.style.setProperty("--dark-purple", "#241638");
        themeToggle.textContent = "Dark 🌙";
    } else {
        document.documentElement.style.setProperty("--bg-primary", "#FBF7FF");
        document.documentElement.style.setProperty("--bg-secondary", "#F3EAFB");
        document.documentElement.style.setProperty("--card-bg", "#FFFFFF");
        document.documentElement.style.setProperty("--text-primary", "#352344");
        document.documentElement.style.setProperty("--text-secondary", "#887694");
        document.documentElement.style.setProperty("--deep-purple", "#241638");
        document.documentElement.style.setProperty("--dark-purple", "#3B245C");
        themeToggle.textContent = "Light ☀️";
    }

    localStorage.setItem("quizoraTheme", theme);
}

setTheme(savedTheme || "light");

themeToggle.addEventListener("click", function () {
    const currentTheme = localStorage.getItem("quizoraTheme");

    if (currentTheme === "light") {
        setTheme("dark");
    } else {
        setTheme("light");
    }
});

startButton.addEventListener("click", function () {
    document.getElementById("topics").scrollIntoView({
        behavior: "smooth"
    });
});

const quizData = {
    HTML: [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Text Machine Language",
                "Hyper Tool Multi Language",
                "Home Text Markup Language"
            ],
            answer: 0
        },
        {
            question: "Which tag is used for the largest heading?",
            options: ["<h6>", "<head>", "<h1>", "<heading>"],
            answer: 2
        },
        {
            question: "Which tag is used to add an image?",
            options: ["<pic>", "<img>", "<image>", "<src>"],
            answer: 1
        }
    ],

    CSS: [
        {
            question: "What does CSS stand for?",
            options: [
                "Creative Style System",
                "Cascading Style Sheets",
                "Computer Style Sheets",
                "Colorful Style System"
            ],
            answer: 1
        },
        {
            question: "Which property changes text color?",
            options: ["background", "font-size", "color", "text-style"],
            answer: 2
        },
        {
            question: "Which CSS property creates a flex layout?",
            options: [
                "display: flex",
                "position: flex",
                "flex: display",
                "align: flex"
            ],
            answer: 0
        }
    ],

    JavaScript: [
        {
            question: "Which keyword declares a variable?",
            options: ["style", "let", "html", "design"],
            answer: 1
        },
        {
            question: "Which method selects an element by its ID?",
            options: [
                "getElementById()",
                "getClass()",
                "queryId()",
                "selectElement()"
            ],
            answer: 0
        },
        {
            question: "Which symbol is used for strict equality?",
            options: ["=", "==", "===", "!="],
            answer: 2
        }
    ],

    "General Knowledge": [
        {
            question: "What is the capital of Pakistan?",
            options: ["Karachi", "Lahore", "Islamabad", "Peshawar"],
            answer: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Jupiter", "Venus"],
            answer: 1
        },
        {
            question: "How many continents are there?",
            options: ["Five", "Six", "Seven", "Eight"],
            answer: 2
        }
    ]
};

function startQuiz(topic) {
    currentTopic = topic;
    currentQuestions = quizData[topic];
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;

    showQuestion();

    quizArea.scrollIntoView({
        behavior: "smooth"
    });
}

function showQuestion() {
    const question = currentQuestions[currentQuestion];

    quizArea.innerHTML = `
        <div class="quiz-box">
            <p class="quiz-label">${currentTopic} QUIZ</p>

            <h2>Hello ${userName}!</h2>

            <p class="question-count">
                Question ${currentQuestion + 1} of ${currentQuestions.length}
            </p>

            <div class="progress">
                <div class="progress-fill" style="width: ${(currentQuestion + 1) / currentQuestions.length * 100}%"></div>
            </div>

            <h2 class="question">${question.question}</h2>

            <div class="options">
                ${question.options.map(function (option, index) {
                    return `
                        <button class="option-btn" data-index="${index}">
                            ${option}
                        </button>
                    `;
                }).join("")}
            </div>

            <button class="next-btn" id="nextBtn" disabled>
                ${currentQuestion === currentQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
        </div>
    `;

    document.querySelectorAll(".option-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            if (selectedAnswer !== null) return;

            selectedAnswer = Number(button.dataset.index);

            document.querySelectorAll(".option-btn").forEach(function (option) {
                option.disabled = true;
            });

            if (selectedAnswer === question.answer) {
                button.classList.add("correct");
            } else {
                button.classList.add("wrong");

                document.querySelectorAll(".option-btn").forEach(function (option) {
                    if (Number(option.dataset.index) === question.answer) {
                        option.classList.add("correct");
                    }
                });
            }

            document.getElementById("nextBtn").disabled = false;
        });
    });

    document.getElementById("nextBtn").addEventListener("click", function () {
        if (selectedAnswer === null) return;

        if (selectedAnswer === question.answer) {
            score++;
        }

        currentQuestion++;
        selectedAnswer = null;

        if (currentQuestion < currentQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });
}

function showResult() {
    const percentage = Math.round((score / currentQuestions.length) * 100);

    let message = "Good effort! Keep practicing!";

    if (percentage === 100) {
        message = "Perfect Score! Amazing work!";
    } else if (percentage >= 60) {
        message = "Great job! Keep it up!";
    }

    const result = {
        name: userName,
        topic: currentTopic,
        score: score,
        total: currentQuestions.length,
        percentage: percentage,
        date: new Date().toLocaleDateString()
    };

    let results = JSON.parse(localStorage.getItem("quizoraResults")) || [];

    results.push(result);

    localStorage.setItem("quizoraResults", JSON.stringify(results));

    quizArea.innerHTML = `
        <div class="quiz-box result-box">
            <div class="result-icon">🏆</div>
            <h2>Quiz Completed!</h2>
            <p>Well done, ${userName}!</p>

            <div class="score-circle">
                <h1>${percentage}%</h1>
                <p>Your Score</p>
            </div>

            <h3>${score} out of ${currentQuestions.length} correct</h3>
            <p class="result-message">${message}</p>

            <button class="next-btn" id="retryBtn">Try Again</button>
            <button class="next-btn" id="homeBtn">Explore Topics</button>

            <div class="history-box">
                <h3>Your Quiz History</h3>
                <div id="historyList"></div>
            </div>
        </div>
    `;

    document.getElementById("retryBtn").addEventListener("click", function () {
        startQuiz(currentTopic);
    });

    document.getElementById("homeBtn").addEventListener("click", function () {
        document.getElementById("topics").scrollIntoView({
            behavior: "smooth"
        });
    });

    showHistory();
}

function showHistory() {
    const historyList = document.getElementById("historyList");
    const results = JSON.parse(localStorage.getItem("quizoraResults")) || [];

    historyList.innerHTML = "";

    results.slice().reverse().forEach(function (result) {
        const item = document.createElement("p");

        item.textContent =
            result.name + " | " +
            result.topic + " | " +
            result.score + "/" +
            result.total + " | " +
            result.percentage + "% | " +
            result.date;

        historyList.appendChild(item);
    });
}

topicCards.forEach(function (card) {
    card.addEventListener("click", function () {
        const topic = card.querySelector("h2").textContent.trim();

        startQuiz(topic);
    });
});

document.querySelectorAll(".card-bottom").forEach(function (item) {
    item.addEventListener("click", function (event) {
        event.stopPropagation();

        const topic = item.closest(".topic-card")
            .querySelector("h2").textContent.trim();

        startQuiz(topic);
    });
});
