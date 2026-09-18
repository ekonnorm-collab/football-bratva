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

    const playerCards =
        document.querySelectorAll(".player-card");

    playerCards.forEach(card => {

        card.addEventListener("click", () => {

            playerCards.forEach(other => {

                if (other !== card) {
                    other.classList.remove(
                        "player-selected"
                    );
                }

            });

            card.classList.toggle(
                "player-selected"
            );

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


    /*
     * Реальный полёт мяча.
     *
     * Мяч стартует рядом с Економ,
     * летит через поле по дуге
     * и попадает в верхний угол ворот.
     */

    function shootBall() {

        return new Promise(resolve => {

            if (!matchBall || !goalSection) {
                resolve();
                return;
            }

            /*
             * Находим само поле.
             */

            const pitch =
                goalSection.querySelector(
                    ".football-pitch"
                );

            if (!pitch) {
                resolve();
                return;
            }


            /*
             * Размеры поля.
             */

            const pitchWidth =
                pitch.clientWidth;

            const pitchHeight =
                pitch.clientHeight;


            /*
             * Размер мяча.
             */

            const ballWidth =
                matchBall.offsetWidth || 42;

            const ballHeight =
                matchBall.offsetHeight || 42;


            /*
             * СТАРТ.
             *
             * Позиция рядом с Економ.
             */

            const startX =
                pitchWidth * 0.24 + 70;

            const startY =
                pitchHeight * 0.50 - 20;


            /*
             * ФИНИШ.
             *
             * Верхний угол ворот Шамиля.
             */

            const endX =
                pitchWidth * 0.91;

            const endY =
                pitchHeight * 0.18;


            /*
             * Сначала полностью сбрасываем
             * CSS-анимацию.
             */

            matchBall.style.animation = "none";

            matchBall.style.left =
                `${startX}px`;

            matchBall.style.top =
                `${startY}px`;

            matchBall.style.transform =
                "scale(1) rotate(0deg)";

            matchBall.style.opacity = "1";


            /*
             * Принудительно обновляем layout.
             */

            void matchBall.offsetWidth;


            /*
             * Длительность удара.
             */

            const duration = 1400;

            const startTime =
                performance.now();


            /*
             * Анимация полёта.
             */

            function animateBall(currentTime) {

                const elapsed =
                    currentTime - startTime;

                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );


                /*
                 * Плавный разгон мяча.
                 */

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                /*
                 * Дуга полёта.
                 *
                 * В середине траектории
                 * мяч заметно поднимается.
                 */

                const arc =
                    -Math.sin(
                        progress * Math.PI
                    ) * pitchHeight * 0.16;


                /*
                 * Текущие координаты.
                 */

                const currentX =
                    startX +
                    (endX - startX) * eased;

                const currentY =
                    startY +
                    (endY - startY) * eased +
                    arc;


                /*
                 * Мяч немного уменьшается,
                 * создавая ощущение полёта вдаль.
                 */

                const scale =
                    1 -
                    progress * 0.38;


                /*
                 * Вращение мяча.
                 */

                const rotation =
                    progress * 1200;


                /*
                 * Применяем координаты.
                 */

                matchBall.style.left =
                    `${currentX}px`;

                matchBall.style.top =
                    `${currentY}px`;

                matchBall.style.transform =
                    `scale(${scale}) rotate(${rotation}deg)`;


                /*
                 * Продолжаем движение.
                 */

                if (progress < 1) {

                    requestAnimationFrame(
                        animateBall
                    );

                } else {

                    /*
                     * Мяч достиг ворот.
                     */

                    matchBall.style.left =
                        `${endX}px`;

                    matchBall.style.top =
                        `${endY}px`;

                    matchBall.style.transform =
                        "scale(0.62) rotate(1200deg)";

                    resolve();

                }

            }


            requestAnimationFrame(
                animateBall
            );

        });

    }


    /*
     * Клик по кнопке "ПОКАЗАТЬ ГОЛ".
     */

    if (goalButton && goalSection) {

        goalButton.addEventListener(
            "click",
            async () => {

                if (goalRunning) return;

                goalRunning = true;


                /*
                 * Сбрасываем старое состояние.
                 */

                goalSection.classList.remove(
                    "goal-scored"
                );


                /*
                 * Сбрасываем мяч.
                 */

                if (matchBall) {

                    matchBall.style.animation =
                        "none";

                    matchBall.style.transform =
                        "scale(1) rotate(0deg)";

                    matchBall.style.opacity =
                        "1";

                }


                /*
                 * Обновляем браузер.
                 */

                void goalSection.offsetWidth;


                /*
                 * Блокируем кнопку.
                 */

                goalButton.disabled = true;

                goalButton.textContent =
                    "УДАР...";


                /*
                 * Запускаем визуальные реакции.
                 */

                goalSection.classList.add(
                    "goal-scored"
                );


                /*
                 * Реальный полёт мяча.
                 */

                await shootBall();


                /*
                 * Гол засчитан.
                 */

                goals++;


                if (scoreElement) {

                    scoreElement.textContent =
                        `${goals} — 0`;

                }


                goalButton.textContent =
                    "ГОЛ ЗАСЧИТАН ✓";


                /*
                 * Даём посмотреть
                 * на празднование.
                 */

                await wait(1700);


                /*
                 * Возвращаем сцену.
                 */

                goalSection.classList.remove(
                    "goal-scored"
                );


                if (matchBall) {

                    matchBall.style.animation =
                        "none";

                    matchBall.style.left = "";

                    matchBall.style.top = "";

                    matchBall.style.transform = "";

                    matchBall.style.opacity = "";

                }


                await wait(500);


                /*
                 * Разблокируем кнопку.
                 */

                goalButton.disabled = false;

                goalButton.textContent =
                    "ПОКАЗАТЬ ГОЛ ⚽";

                goalRunning = false;

            }
        );

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
     * Получаем центр игрока
     * относительно тактического поля.
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
     * Устанавливаем позицию
     * тактического мяча.
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
     * Плавный пас.
     */

    function passBall(
        from,
        to,
        duration = 850
    ) {

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
                                `${Math.min(
                                    start.y,
                                    end.y
                                ) - 35}px`,

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

                        fill:
                            "forwards"

                    }
                );


            animation.finished
                .then(resolve)
                .catch(resolve);

        });

    }


    /*
     * Рисуем линию между игроками.
     */

    function drawLine(
        line,
        from,
        to
    ) {

        if (!line) return;

        const start =
            getPlayerCenter(from);

        const end =
            getPlayerCenter(to);

        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const angle =
            Math.atan2(
                dy,
                dx
            ) *
            180 /
            Math.PI;

        line.style.left =
            `${start.x}px`;

        line.style.top =
            `${start.y}px`;

        line.style.width =
            `${distance}px`;

        line.style.transform =
            `rotate(${angle}deg)`;

    }


    /*
     * Перестраиваем линии.
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
     * Тактическая атака.
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

        tacticsBoard.classList.add(
            "playing"
        );

        tacticBall.style.opacity =
            "1";


        redrawTacticLines();


        /*
         * Мяч у Шамиля.
         */

        setBallPosition(
            getPlayerCenter(shamil)
        );


        tacticMessage.textContent =
            "ШАМИЛЬ НАЧИНАЕТ АТАКУ...";


        await wait(500);


        /*
         * ШАМИЛЬ → АЗИК
         */

        tacticMessage.textContent =
            "ШАМИЛЬ → АЗИК";

        await passBall(
            shamil,
            azamat,
            850
        );

        await wait(250);


        /*
         * АЗИК → ГАЛЫМ
         */

        tacticMessage.textContent =
            "АЗИК → ГАЛЫМ";

        await passBall(
            azamat,
            galym,
            850
        );

        await wait(250);


        /*
         * ГАЛЫМ → ЕКОН
         */

        tacticMessage.textContent =
            "ГАЛЫМ → ЕКОН";

        await passBall(
            galym,
            ekon,
            900
        );

        await wait(300);


        /*
         * ФИНАЛЬНЫЙ УДАР.
         */

        tacticMessage.textContent =
            "ЕКОН... УДАР! 🔥";

        await wait(500);


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

                        fill:
                            "forwards"

                    }
                );


            animation.finished
                .then(resolve)
                .catch(resolve);

        });


        tacticMessage.textContent =
            "ГОООООЛ! ЕКОН ЗАВЕРШАЕТ АТАКУ! ⚽🔥";


        /*
         * Реакция игроков.
         */

        [
            shamil,
            azamat,
            galym,
            ekon
        ].forEach(player => {

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

                    easing:
                        "ease-out"

                }
            );

        });


        await wait(1700);


        /*
         * Возвращаем всё.
         */

        tacticBall.style.opacity =
            "0";

        tacticsBoard.classList.remove(
            "playing"
        );

        tacticMessage.textContent =
            "ГОТОВЫ К АТАКЕ?";

        tacticButton.disabled =
            false;

        tacticRunning =
            false;

    }


    if (tacticButton) {

        tacticButton.addEventListener(
            "click",
            runTactic
        );

    }


    /*
     * Перестраиваем линии
     * при изменении размера окна.
     */

    window.addEventListener(
        "resize",
        () => {

            if (!tacticsBoard) return;

            redrawTacticLines();

        }
    );


    /* =====================================================
       RANDOM EVENT
       ===================================================== */

    const randomButton =
        $("#randomButton");

    const randomEvent =
        $("#randomEvent");


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

                randomButton.disabled =
                    true;

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


                lastEvent =
                    index;


                randomEvent.textContent =
                    events[index];


                randomEvent.classList.remove(
                    "random-changing"
                );


                await wait(350);


                randomButton.disabled =
                    false;

            }
        );

    }


    /* =====================================================
       BUTTON RIPPLE
       ===================================================== */

    const buttons =
        document.querySelectorAll(
            ".main-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "pointerdown",
            event => {

                const rect =
                    button.getBoundingClientRect();


                const ripple =
                    document.createElement(
                        "span"
                    );


                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );


                ripple.style.position =
                    "absolute";

                ripple.style.width =
                    `${size}px`;

                ripple.style.height =
                    `${size}px`;

                ripple.style.borderRadius =
                    "50%";

                ripple.style.background =
                    "rgba(255,255,255,0.35)";

                ripple.style.pointerEvents =
                    "none";


                ripple.style.left =
                    `${event.clientX -
                    rect.left -
                    size / 2}px`;


                ripple.style.top =
                    `${event.clientY -
                    rect.top -
                    size / 2}px`;


                ripple.style.transform =
                    "scale(0)";


                ripple.style.transition =
                    "transform 0.5s ease, opacity 0.5s ease";


                button.style.overflow =
                    "hidden";


                button.appendChild(
                    ripple
                );


                requestAnimationFrame(
                    () => {

                        ripple.style.transform =
                            "scale(1.5)";

                        ripple.style.opacity =
                            "0";

                    }
                );


                setTimeout(
                    () => {

                        ripple.remove();

                    },
                    550
                );

            }
        );

    });


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    window.requestAnimationFrame(
        () => {

            if (tacticsBoard) {

                redrawTacticLines();

            }

        }
    );

});
