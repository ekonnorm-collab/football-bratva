const goalButton = document.getElementById("goalButton");
const tacticButton = document.getElementById("tacticButton");

const pitch = document.querySelector(".pitch");
const tacticsBoard = document.querySelector(".tactics-board");

const score = document.getElementById("score");
const tacticMessage = document.getElementById("tacticMessage");

let goals = 0;
let goalRunning = false;
let tacticRunning = false;


/* =========================
   ГОЛ ЕКОНА
========================= */

goalButton.addEventListener("click", () => {

    if (goalRunning) return;

    goalRunning = true;

    // Перезапускаем CSS-анимацию
    pitch.classList.remove("goal-scored");

    void pitch.offsetWidth;

    pitch.classList.add("goal-scored");

    goalButton.textContent = "⚡ ЕКОН БЬЁТ...";

    setTimeout(() => {
        goalButton.textContent = "💥 ГОООООЛ!";
    }, 900);


    setTimeout(() => {

        goals++;

        score.textContent = `${goals} — 0`;

    }, 1200);


    setTimeout(() => {

        goalButton.textContent = "⚽ ПОКАЗАТЬ ГОЛ";

        pitch.classList.remove("goal-scored");

        goalRunning = false;

    }, 4200);

});


/* =========================
   ТАКТИКА
========================= */

tacticButton.addEventListener("click", () => {

    if (tacticRunning) return;

    tacticRunning = true;

    tacticsBoard.classList.remove("playing");

    void tacticsBoard.offsetWidth;

    tacticsBoard.classList.add("playing");

    tacticButton.textContent = "⚡ КОМБИНАЦИЯ...";

    tacticMessage.textContent = "ШАМИЛЬ → АЗИК";


    setTimeout(() => {
        tacticMessage.textContent = "АЗИК → ГАЛЫМ";
    }, 1500);


    setTimeout(() => {
        tacticMessage.textContent = "ГАЛЫМ → ЕКОН";
    }, 2900);


    setTimeout(() => {
        tacticMessage.textContent = "ЕКОН БЬЁТ!!!";
    }, 3900);


    setTimeout(() => {
        tacticMessage.textContent = "🔥 ГООООООООЛ!";
        tacticButton.textContent = "🔄 ПОВТОРИТЬ ТАКТИКУ";
    }, 4500);


    setTimeout(() => {

        tacticsBoard.classList.remove("playing");

        tacticRunning = false;

    }, 6000);

});


/* =========================
   ПОЯВЛЕНИЕ СЕКЦИЙ
========================= */

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }

        });

    },
    {
        threshold: 0.12
    }
);

sections.forEach(section => {
    observer.observe(section);
});


/* =========================
   КАРТОЧКИ ИГРОКОВ
========================= */

const playerCards = document.querySelectorAll(".player-card");

playerCards.forEach(card => {

    card.addEventListener("click", () => {

        const player = card.dataset.player;

        const names = {
            ekon: "ЕКОН — ГЛАВНЫЙ БОМБАРДИР ⚽",
            azamat: "АЗИК — ЦЕНТРАЛЬНЫЙ ЗАЩИТНИК 🧱",
            galym: "ГАЛЫМ — СВОБОДНЫЙ ХУДОЖНИК 🎨",
            shamil: "ШАМИЛЬ — ФЛАНГОВЫЙ МАЭСТРО 🧤"
        };

        alert(names[player]);

    });

});


/* =========================
   СЛУЧАЙНЫЙ МАТЧ
========================= */

const randomResults = [
    "5 — 2",
    "4 — 1",
    "7 — 3",
    "6 — 4",
    "3 — 2",
    "8 — 5"
];

const matches = document.querySelectorAll(".match");

matches.forEach(match => {

    match.addEventListener("click", () => {

        const result =
            randomResults[
                Math.floor(Math.random() * randomResults.length)
            ];

        const scoreElement = match.querySelector("strong");

        scoreElement.textContent = result;

    });

});
