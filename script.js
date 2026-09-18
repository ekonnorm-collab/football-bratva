/* =========================================================
   ФК БРАТВА — SCRIPT.JS
   СЕЗОН 2026
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. ПОЯВЛЕНИЕ БЛОКОВ ПРИ СКРОЛЛЕ
       ===================================================== */

    const revealItems = document.querySelectorAll(
        ".section-heading, .player-card, .match-row, .big-stat, .gallery-card, .history-section, .event-section, .footer"
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });


    /* =====================================================
       2. АНИМАЦИЯ ГОЛА
       ===================================================== */

    const goalSection = document.querySelector(".goal-section");
    const goalButton = document.querySelector("#goalButton");
    const matchBall = document.querySelector("#matchBall");

    if (goalButton && goalSection && matchBall) {

        function shootBall() {

            const pitch = goalSection.querySelector(".football-pitch");

            if (!pitch) return;

            const pitchWidth = pitch.clientWidth;
            const pitchHeight = pitch.clientHeight;

            const startX = pitchWidth * 0.24 + 70;
            const startY = pitchHeight * 0.50 - 20;

            const endX = pitchWidth * 0.89;
            const endY = pitchHeight * 0.40;

            matchBall.style.animation = "none";

            matchBall.style.left = `${startX}px`;
            matchBall.style.top = `${startY}px`;

            matchBall.style.transform =
                "translate(0, 0) scale(1) rotate(0deg)";

            void matchBall.offsetWidth;

            const duration = 1400;
            const startTime = performance.now();

            function animateBall(currentTime) {

                const elapsed = currentTime - startTime;

                let progress = elapsed / duration;

                if (progress > 1) {
                    progress = 1;
                }

                const eased =
                    1 - Math.pow(1 - progress, 3);

                const x =
                    startX +
                    (endX - startX) * eased;

                const arc =
                    -Math.sin(progress * Math.PI) *
                    pitchHeight *
                    0.08;

                const y =
                    startY +
                    (endY - startY) * eased +
                    arc;

                const scale =
                    1 - progress * 0.4;

                const rotation =
                    progress * 1200;

                matchBall.style.left =
                    `${x}px`;

                matchBall.style.top =
                    `${y}px`;

                matchBall.style.transform =
                    `translate(0, 0) scale(${scale}) rotate(${rotation}deg)`;

                if (progress < 1) {

                    requestAnimationFrame(
                        animateBall
                    );

                } else {

                    goalSection.classList.add(
                        "goal-scored"
                    );

                    const score =
                        document.querySelector("#score");

                    if (score) {
                        score.textContent = "1 — 0";
                    }

                    setTimeout(() => {

                        goalSection.classList.remove(
                            "goal-scored"
                        );

                        matchBall.style.animation =
                            "none";

                        matchBall.style.left =
                            `${startX}px`;

                        matchBall.style.top =
                            `${startY}px`;

                        matchBall.style.transform =
                            "translate(0, 0) scale(1) rotate(0deg)";

                    }, 4000);
                }
            }

            requestAnimationFrame(
                animateBall
            );
        }

        goalButton.addEventListener(
            "click",
            shootBall
        );
    }


    /* =====================================================
       3. КАРТОЧКИ ИГРОКОВ
       ===================================================== */

    const playerCards =
        document.querySelectorAll(".player-card");

    playerCards.forEach((card) => {

        card.addEventListener("click", () => {

            card.classList.toggle("active");

        });

    });

/* =====================================================
   4. ТАКТИКА — ПАСЫ
   ===================================================== */

const tacticButton =
    document.querySelector("#tacticButton");

const tacticsBoard =
    document.querySelector("#tacticsBoard");

const tacticBall =
    document.querySelector("#tacticBall");

const tacticMessage =
    document.querySelector("#tacticMessage");

const tacticPlayers =
    document.querySelectorAll(".tactic-player");

if (
    tacticButton &&
    tacticsBoard &&
    tacticBall
) {

    tacticButton.addEventListener("click", () => {

        /* Защита от повторного запуска */
        if (tacticsBoard.classList.contains("playing")) {
            return;
        }

        tacticsBoard.classList.add("playing");

        /* Начальная позиция */
        tacticBall.style.transition = "none";

        tacticBall.style.left = "18%";
        tacticBall.style.top = "72%";

        /* Сбрасываем активных игроков */
        tacticPlayers.forEach((player) => {
            player.classList.remove("active");
        });

        if (tacticMessage) {
            tacticMessage.textContent = "ШАМИЛЬ → АЗИК";
        }

        /* Координаты пасов */
        const passes = [
            {
                player: ".tactic-shamil",
                x: "38%",
                y: "58%",
                text: "ШАМИЛЬ → АЗИК"
            },
            {
                player: ".tactic-azamat",
                x: "58%",
                y: "42%",
                text: "АЗИК → ГАЛЫМ"
            },
            {
                player: ".tactic-galym",
                x: "78%",
                y: "30%",
                text: "ГАЛЫМ → ЕКОН"
            },
            {
                player: ".tactic-ekon",
                x: "88%",
                y: "22%",
                text: "ЕКОН ⚽ ГООООЛ!"
            }
        ];

        let index = 0;

        function nextPass() {

            if (index >= passes.length) {

                setTimeout(() => {

                    tacticsBoard.classList.remove(
                        "playing"
                    );

                    tacticPlayers.forEach((player) => {
                        player.classList.remove("active");
                    });

                }, 1200);

                return;
            }

            const pass = passes[index];

            const player =
                tacticsBoard.querySelector(pass.player);

            if (player) {

                tacticPlayers.forEach((item) => {
                    item.classList.remove("active");
                });

                player.classList.add("active");
            }

            if (tacticMessage) {
                tacticMessage.textContent =
                    pass.text;
            }

            tacticBall.style.transition =
                "left 0.65s cubic-bezier(0.4, 0, 0.2, 1), top 0.65s cubic-bezier(0.4, 0, 0.2, 1)";

            tacticBall.style.left = pass.x;
            tacticBall.style.top = pass.y;

            index++;

            setTimeout(nextPass, 700);
        }

        nextPass();
    });
}
  


    /* =====================================================
       5. СЛУЧАЙНОЕ СОБЫТИЕ
       ===================================================== */

    const randomButton =
        document.querySelector("#randomButton");

    const randomEventText =
        document.querySelector("#randomEvent");

    const events = [

        "⚽ Екон забивает с дальней дистанции!",

        "🔥 Галым разгоняет атаку!",

        "🧤 Шамиль снова спасает ворота!",

        "💨 Азик убежал по флангу!",

        "🎯 Идеальная передача на Екона!",

        "😂 Галым опять спорит с судьёй!",

        "🥶 Шамиль вытащил невозможный удар!",

        "🚀 Екон пробил — перекладина!",

        "🔥 БРАТВА ВЫХОДИТ НА ПОЛЕ!",

        "⚡ Молниеносная контратака!"

    ];

    if (randomButton && randomEventText) {

        randomButton.addEventListener("click", () => {

            const randomIndex =
                Math.floor(
                    Math.random() * events.length
                );

            randomEventText.textContent =
                events[randomIndex];

            randomEventText.classList.remove(
                "event-pop"
            );

            void randomEventText.offsetWidth;

            randomEventText.classList.add(
                "event-pop"
            );

        });

    }


    /* =====================================================
       6. RIPPLE-ЭФФЕКТ КНОПОК
       ===================================================== */

    const buttons =
        document.querySelectorAll("button");

    buttons.forEach((button) => {

        button.addEventListener("click", function (event) {

            const ripple =
                document.createElement("span");

            ripple.classList.add("ripple");

            const rect =
                this.getBoundingClientRect();

            ripple.style.left =
                `${event.clientX - rect.left}px`;

            ripple.style.top =
                `${event.clientY - rect.top}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

        });

    });


    /* =====================================================
       7. ПЛАВНАЯ ПРОКРУТКА
       ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       8. АНИМАЦИЯ СТАТИСТИКИ
       ===================================================== */

    const statNumbers =
        document.querySelectorAll(".stat-number");

    const statObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const element =
                        entry.target;

                    const target =
                        parseInt(
                            element.dataset.value ||
                            element.textContent ||
                            "0",
                            10
                        );

                    if (isNaN(target)) {
                        return;
                    }

                    let current = 0;

                    const duration = 1000;

                    const start =
                        performance.now();

                    function countAnimation(time) {

                        const progress =
                            Math.min(
                                (time - start) /
                                duration,
                                1
                            );

                        current =
                            Math.floor(
                                target *
                                (
                                    1 -
                                    Math.pow(
                                        1 - progress,
                                        3
                                    )
                                )
                            );

                        element.textContent =
                            current;

                        if (progress < 1) {

                            requestAnimationFrame(
                                countAnimation
                            );

                        }

                    }

                    requestAnimationFrame(
                        countAnimation
                    );

                    observer.unobserve(element);

                });

            },
            {
                threshold: 0.5
            }
        );

    statNumbers.forEach((number) => {
        statObserver.observe(number);
    });


    /* =====================================================
       9. ЗАГРУЗКА САЙТА
       ===================================================== */

    document.body.classList.add(
        "page-loaded"
    );

});
console.log("ТАКТИКА TEST");

const testButton = document.querySelector("#tacticButton");

console.log("КНОПКА:", testButton);

if (testButton) {
    testButton.addEventListener("click", () => {
        console.log("КНОПКА ТАКТИКИ НАЖАТА");
        alert("ТАКТИКА РАБОТАЕТ");
    });
}
