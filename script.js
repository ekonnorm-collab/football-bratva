/* =========================================================
   ФК БРАТВА — SCRIPT.JS
   СЕЗОН 2026
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (selector) => document.querySelector(selector);

    const wait = (ms) =>
        new Promise(resolve => setTimeout(resolve, ms));


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const sections = document.querySelectorAll(
        ".team-section, .goal-section, .tactics-section, " +
        ".matches-section, .stats-section, .gallery-section, " +
        ".history-section, .event-section"
    );

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("section-visible");

                observer.unobserve(entry.target);
            });

        },
        {
            threshold: 0.12
        }
    );

    sections.forEach(section => {
        revealObserver.observe(section);
    });


    /* =====================================================
       PLAYER CARDS
       ===================================================== */

    const playerCards = document.querySelectorAll(".player-card");

    playerCards.forEach(card => {

        card.addEventListener("click", () => {

            playerCards.forEach(other => {
                if (other !== card) {
                    other.classList.remove("player-selected");
                }
            });

            card.classList.toggle("player-selected");

        });

    });


    /* =====================================================
       LIVE GOAL
       ===================================================== */

    const goalButton = $("#goalButton");
    const goalSection = $(".goal-section");
    const scoreElement = $("#score");
    const matchBall = $("#matchBall");
    const goalText = $("#goalText");
    const celebration = $("#celebration");

    let goals = 0;
    let goalRunning = false;

    if (goalButton && goalSection) {

        goalButton.addEventListener("click", async () => {

            if (goalRunning) return;

            goalRunning = true;

            /*
             * Сбрасываем предыдущую анимацию.
             */

            goalSection.classList.remove("goal-scored");

            /*
             * Небольшая пауза нужна браузеру,
             * чтобы CSS точно перезапустил animation.
             */

            void goalSection.offsetWidth;

            goalButton.disabled = true;

            goalButton.textContent = "УДАР...";

            /*
             * Ставим мяч обратно к Екону.
             */

            if (matchBall) {
                matchBall.style.animation = "none";

                void matchBall.offsetWidth;

                matchBall.style.left = "";
                matchBall.style.top = "";
            }

            /*
             * Запускаем удар.
             */

            goalSection.classList.add("goal-scored");

            await wait(1350);

            /*
             * Гол засчитан.
             */

            goals++;

            if (scoreElement) {
                scoreElement.textContent = `${goals} — 0`;
            }

            goalButton.textContent = "ГОЛ ЗАСЧИТАН ✓";

            await wait(1700);

            /*
             * Возвращаем сцену в исходное состояние.
             */

            goalSection.classList.remove("goal-scored");

            await wait(500);

            goalButton.disabled = false;
            goalButton.textContent = "ПОКАЗАТЬ ГОЛ ⚽";

            goalRunning = false;

        });

    }


    /* =====================================================
       TACTICS
       ===================================================== */

    const tacticButton = $("#tacticButton");
    const tacticsBoard = $("#tacticsBoard");
    const tacticBall = $("#tacticBall");
    const tacticMessage = $("#tacticMessage");

    const shamil = $(".tactic-shamil");
    const azamat = $(".tactic-azamat");
    const galym = $(".tactic-galym");
    const ekon = $(".tactic-ekon");

    const lineShamil = $(".line-shamil");
    const lineAzamat = $(".line-azamat");
    const lineGalym = $(".line-galym");

    let tacticRunning = false;


    /*
     * Получаем центр игрока относительно поля.
     */

    function getPlayerCenter(player) {

        if (!player || !tacticsBoard) {
            return {
                x: 0,
                y: 0
            };
        }

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
     * Перемещаем мяч в точку.
     */

    function setBallPosition(point) {

        if (!tacticBall) return;

        const ballWidth =
            tacticBall.offsetWidth || 35;

        const ballHeight =
            tacticBall.offsetHeight || 35;

        tacticBall.style.left =
            `${point.x - ballWidth / 2}px`;

        tacticBall.style.top =
            `${point.y - ballHeight / 2}px`;
    }


    /*
     * Плавный пас мяча от одного игрока к другому.
     *
     * Важный момент:
     * координаты каждый раз берутся из DOM.
     * Поэтому при изменении размера экрана
     * маршрут тоже автоматически корректный.
     */

    function passBall(from, to, duration = 850) {

        return new Promise(resolve => {

            if (!tacticBall) {
                resolve();
                return;
            }

            const start =
                getPlayerCenter(from);

            const end =
                getPlayerCenter(to);

            setBallPosition(start);

            const animation =
                tacticBall.animate(
                    [
                        {
                            left:
                                `${start.x - 17}px`,
                            top:
                                `${start.y - 17}px`,
                            transform:
                                "scale(0.9) rotate(0deg)"
                        },

                        {
                            left:
                                `${(start.x + end.x) / 2 - 17}px`,
                            top:
                                `${Math.min(start.y, end.y) - 35}px`,
                            transform:
                                "scale(1.08) rotate(360deg)"
                        },

                        {
                            left:
                                `${end.x - 17}px`,
                            top:
                                `${end.y - 17}px`,
                            transform:
                                "scale(1) rotate(720deg)"
                        }
                    ],
                    {
                        duration,
                        easing:
                            "cubic-bezier(.2,.8,.2,1)",
                        fill: "forwards"
                    }
                );

            animation.finished
                .then(resolve)
                .catch(resolve);

        });
    }


    /*
     * Рисуем линию между двумя игроками.
     */

    function drawLine(line, from, to) {

        if (!line) return;

        const start =
            getPlayerCenter(from);

        const end =
            getPlayerCenter(to);

        const dx = end.x - start.x;
        const dy = end.y - start.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        const angle =
            Math.atan2(dy, dx) *
            180 /
            Math.PI;

        line.style.left = `${start.x}px`;
        line.style.top = `${start.y}px`;
        line.style.width = `${distance}px`;
        line.style.transform =
            `rotate(${angle}deg)`;
    }


    /*
     * Перестраиваем все линии.
     *
     * Шамиль → Азик
     * Азик → Галым
     * Галым → Екон
     */

    function redrawTacticLines() {

        drawLine(
            lineShamil,
            shamil,
            azamat
        );

        drawLine(
            lineAzamat,
            azamat,
            galym
        );

        drawLine(
            lineGalym,
            galym,
            ekon
        );

    }


    /*
     * Сама тактическая атака.
     */

    async function runTactic() {

        if (tacticRunning) return;

        if (
            !tacticsBoard ||
            !tacticBall ||
            !shamil ||
            !azamat ||
            !galym ||
            !ekon
        ) {
            return;
        }

        tacticRunning = true;

        tacticButton.disabled = true;

        tacticsBoard.classList.add("playing");

        tacticBall.style.opacity = "1";

        /*
         * Перед стартом точно рассчитываем линии.
         */

        redrawTacticLines();

        /*
         * Ставим мяч в Шамиля.
         */

        setBallPosition(
            getPlayerCenter(shamil)
        );

        tacticMessage.textContent =
            "ШАМИЛЬ НАЧИНАЕТ АТАКУ...";

        await wait(500);


        /* =========================
           ПАС 1
           ШАМИЛЬ → АЗИК
           ========================= */

        tacticMessage.textContent =
            "ШАМИЛЬ → АЗИК";

        await passBall(
            shamil,
            azamat,
            850
        );

        await wait(250);


        /* =========================
           ПАС 2
           АЗИК → ГАЛЫМ
           ========================= */

        tacticMessage.textContent =
            "АЗИК → ГАЛЫМ";

        await passBall(
            azamat,
            galym,
            850
        );

        await wait(250);


        /* =========================
           ПАС 3
           ГАЛЫМ → ЕКОН
           ========================= */

        tacticMessage.textContent =
            "ГАЛЫМ → ЕКОН";

        await passBall(
            galym,
            ekon,
            900
        );

        await wait(300);


        /* =========================
           ФИНАЛ
           ========================= */

        tacticMessage.textContent =
            "ЕКОН... УДАР! 🔥";

        await wait(500);

        /*
         * Мяч делает небольшой рывок
         * вперёд от Екона.
         */

        const ekonPoint =
            getPlayerCenter(ekon);

        const boardRect =
            tacticsBoard.getBoundingClientRect();

        const finalX =
            Math.min(
                boardRect.width - 35,
                ekonPoint.x + 90
            );

        const finalY =
            Math.max(
                35,
                ekonPoint.y - 55
            );

        await new Promise(resolve => {

            const animation =
                tacticBall.animate(
                    [
                        {
                            left:
                                `${ekonPoint.x - 17}px`,
                            top:
                                `${ekonPoint.y - 17}px`,
                            transform:
                                "scale(1) rotate(0deg)"
                        },

                        {
                            left:
                                `${finalX - 17}px`,
                            top:
                                `${finalY - 17}px`,
                            transform:
                                "scale(0.75) rotate(600deg)"
                        }
                    ],
                    {
                        duration: 700,
                        easing:
                            "cubic-bezier(.15,.8,.2,1)",
                        fill: "forwards"
                    }
                );

            animation.finished
                .then(resolve)
                .catch(resolve);

        });


        tacticMessage.textContent =
            "ГОООООЛ! ЕКОН ЗАВЕРШАЕТ АТАКУ! ⚽🔥";

        /*
         * Маленькая реакция игроков.
         */

        [shamil, azamat, galym, ekon]
            .forEach(player => {

                player.animate(
                    [
                        {
                            transform:
                                player === shamil
                                    ? "translateY(-50%) scale(1)"
                                    : "scale(1)"
                        },

                        {
                            transform:
                                player === shamil
                                    ? "translateY(-50%) scale(1.12)"
                                    : "scale(1.12)"
                        },

                        {
                            transform:
                                player === shamil
                                    ? "translateY(-50%) scale(1)"
                                    : "scale(1)"
                        }
                    ],
                    {
                        duration: 500,
                        easing: "ease-out"
                    }
                );

            });


        await wait(1700);


        /*
         * Возвращаем всё.
         */

        tacticBall.style.opacity = "0";

        tacticsBoard.classList.remove("playing");

        tacticMessage.textContent =
            "ГОТОВЫ К АТАКЕ?";

        tacticButton.disabled = false;

        tacticRunning = false;

    }


    if (tacticButton) {

        tacticButton.addEventListener(
            "click",
            runTactic
        );

    }


    /*
     * При изменении размера окна
     * линии пересчитываются.
     */

    window.addEventListener(
        "resize",
        () => {

            if (!tacticsBoard) return;

            redrawTacticLines();

            if (
                tacticBall &&
                tacticBall.style.opacity === "1"
            ) {
                /*
                 * Во время движения не вмешиваемся
                 * в позицию мяча.
                 */
                return;
            }

        }
    );


    /* =====================================================
       RANDOM EVENT
       ===================================================== */

    const randomButton = $("#randomButton");
    const randomEvent = $("#randomEvent");

    const events = [

        "ЕКОН ЗАБЬЁТ С ДАЛЬНЕЙ ДИСТАНЦИИ. 🎯",

        "АЗИК СЕГОДНЯ — НЕПРОХОДИМАЯ СТЕНА. 🧱",

        "ГАЛЫМ ПРИДУМАЕТ ФИНТ, КОТОРЫЙ НИКТО НЕ ЖДАЛ. 🕺",

        "ШАМИЛЬ ВЫТАЩИТ НЕВЕРОЯТНЫЙ МЯЧ. 🧤",

        "БРАТВА ЗАСИДИТСЯ НА ПОЛЕ ДО ТЕМНОТЫ. 🌙",

        "КТО-ТО СКАЖЕТ: «ЕЩЁ ОДИН МАТЧ». ⚽",

        "СЕГОДНЯ БУДЕТ МНОГО ГОЛОВ. 🔥",

        "ГАЛЫМ ОТДАСТ ПАС ТУДА, КУДА НИКТО НЕ СМОТРЕЛ. 👀",

        "АЗИК СКАЖЕТ, ЧТО ЭТО БЫЛО ЛЕГКО. 😎",

        "ШАМИЛЬ СНОВА ОКАЖЕТСЯ НЕ ТАМ, ГДЕ ЕГО ЖДАЛИ. 😂",

        "ЕКОН ПОПРОБУЕТ ЗАБИТЬ В ВЕРХНИЙ УГОЛ. 🚀",

        "БРАТВА СОБЕРЁТСЯ НА ЕЩЁ ОДИН ФУТБОЛЬНЫЙ ВЕЧЕР. 🟢"

    ];


    let lastEvent = -1;

    if (randomButton && randomEvent) {

        randomButton.addEventListener(
            "click",
            async () => {

                randomButton.disabled = true;

                randomEvent.classList.add(
                    "random-changing"
                );

                await wait(250);

                let index;

                do {
                    index =
                        Math.floor(
                            Math.random() *
                            events.length
                        );
                } while (
                    events.length > 1 &&
                    index === lastEvent
                );

                lastEvent = index;

                randomEvent.textContent =
                    events[index];

                randomEvent.classList.remove(
                    "random-changing"
                );

                await wait(350);

                randomButton.disabled = false;

            }
        );

    }


    /* =====================================================
       BUTTON RIPPLE
       ===================================================== */

    const buttons =
        document.querySelectorAll(".main-button");

    buttons.forEach(button => {

        button.addEventListener(
            "pointerdown",
            event => {

                const rect =
                    button.getBoundingClientRect();

                const ripple =
                    document.createElement("span");

                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );

                ripple.style.position = "absolute";
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.borderRadius = "50%";
                ripple.style.background =
                    "rgba(255,255,255,0.35)";
                ripple.style.pointerEvents = "none";

                ripple.style.left =
                    `${event.clientX - rect.left - size / 2}px`;

                ripple.style.top =
                    `${event.clientY - rect.top - size / 2}px`;

                ripple.style.transform =
                    "scale(0)";

                ripple.style.transition =
                    "transform 0.5s ease, opacity 0.5s ease";

                button.style.overflow = "hidden";

                button.appendChild(ripple);

                requestAnimationFrame(() => {

                    ripple.style.transform =
                        "scale(1.5)";

                    ripple.style.opacity = "0";

                });

                setTimeout(() => {
                    ripple.remove();
                }, 550);

            }
        );

    });


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    /*
     * Если пользователь сразу изменил размер окна,
     * линии всё равно будут правильными.
     */

    window.requestAnimationFrame(() => {

        if (tacticsBoard) {
            redrawTacticLines();
        }

    });

});
