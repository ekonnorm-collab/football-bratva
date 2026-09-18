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

        if (tacticsBoard.classList.contains("playing")) {
            return;
        }

        tacticsBoard.classList.add("playing");

        tacticPlayers.forEach((player) => {
            player.classList.remove("active");
        });

        /*
         * Получаем координаты центра игрока
         * относительно тактической доски
         */
        function getPlayerPosition(player) {

            const boardRect =
                tacticsBoard.getBoundingClientRect();

            const playerRect =
                player.getBoundingClientRect();

            return {
                x:
                    playerRect.left +
                    playerRect.width / 2 -
                    boardRect.left,

                y:
                    playerRect.top +
                    playerRect.height / 2 -
                    boardRect.top
            };
        }


        /*
         * Перемещаем мяч к игроку
         */
function moveBallTo(player, duration = 650) {

    const boardRect =
        tacticsBoard.getBoundingClientRect();

    const ballRect =
        tacticBall.getBoundingClientRect();

    const playerRect =
        player.getBoundingClientRect();

    const startX =
        ballRect.left +
        ballRect.width / 2 -
        boardRect.left;

    const startY =
        ballRect.top +
        ballRect.height / 2 -
        boardRect.top;

    const endX =
        playerRect.left +
        playerRect.width / 2 -
        boardRect.left;

    const endY =
        playerRect.top +
        playerRect.height / 2 -
        boardRect.top;

    const dx = endX - startX;
    const dy = endY - startY;

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    const angle =
        Math.atan2(dy, dx) * 180 / Math.PI;

    const line =
        document.createElement("div");

    line.classList.add("tactic-pass-line");

    line.style.left =
        `${startX}px`;

    line.style.top =
        `${startY}px`;

    line.style.width =
        `${distance}px`;

    line.style.transform =
        `rotate(${angle}deg)`;

    tacticsBoard.appendChild(line);

    tacticBall.style.transition =
        `left ${duration}ms cubic-bezier(0.4, 0, 0.2, 1),
         top ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

    tacticBall.style.left =
        `${endX}px`;

    tacticBall.style.top =
        `${endY}px`;

    setTimeout(() => {
        line.remove();
    }, duration);
}
        /*
         * Последовательность пасов
         */
        const passes = [
            {
                selector: ".tactic-shamil",
                text: "ШАМИЛЬ → АЗИК"
            },
            {
                selector: ".tactic-azamat",
                text: "АЗИК → ГАЛЫМ"
            },
            {
                selector: ".tactic-galym",
                text: "ГАЛЫМ → ЕКОН"
            },
            {
                selector: ".tactic-ekon",
                text: "ЕКОН ⚽ ГООООЛ!"
            }
        ];


        /*
         * Ставим мяч к первому игроку
         */
        const firstPlayer =
            tacticsBoard.querySelector(
                passes[0].selector
            );

        if (!firstPlayer) {
            tacticsBoard.classList.remove("playing");
            return;
        }

        const firstPosition =
            getPlayerPosition(firstPlayer);

        tacticBall.style.transition = "none";

        tacticBall.style.left =
            `${firstPosition.x}px`;

        tacticBall.style.top =
            `${firstPosition.y}px`;


        let index = 0;


        function nextPass() {

            if (index >= passes.length) {

                if (tacticMessage) {
                    tacticMessage.textContent =
                        "АТАКА ЗАВЕРШЕНА 🔥";
                }

                const ekon =
                    tacticsBoard.querySelector(
                        ".tactic-ekon"
                    );

                if (ekon) {
                    ekon.classList.add("active");
                }

                setTimeout(() => {

                    tacticsBoard.classList.remove(
                        "playing"
                    );

                    tacticPlayers.forEach((player) => {
                        player.classList.remove("active");
                    });

                }, 1500);

                return;
            }


            const pass =
                passes[index];

            const player =
                tacticsBoard.querySelector(
                    pass.selector
                );


            if (!player) {
                index++;
                nextPass();
                return;
            }


            /*
             * Подсвечиваем игрока
             */
            tacticPlayers.forEach((item) => {
                item.classList.remove("active");
            });

            player.classList.add("active");


            /*
             * Меняем текст
             */
            if (tacticMessage) {
                tacticMessage.textContent =
                    pass.text;
            }


            /*
             * Полёт мяча
             */
            moveBallTo(player, 650);


            index++;

            setTimeout(() => {
                nextPass();
            }, 800);
        }


        /*
         * Начинаем
         */
        setTimeout(() => {
            nextPass();
        }, 300);
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
