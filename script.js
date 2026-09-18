/* =========================================================
   ФК БРАТВА — SCRIPT.JS
   СЕЗОН 2026
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. ПОЯВЛЕНИЕ БЛОКОВ ПРИ СКРОЛЛЕ
       ===================================================== */

    const revealItems = document.querySelectorAll(
        ".section-title, .player-card, .match-card, .stat-card, .history-item, .gallery-item, .tactic-step"
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

            /*
             * НАЧАЛО:
             * мяч находится возле Екона
             */
            const startX = pitchWidth * 0.24 + 70;
            const startY = pitchHeight * 0.50 - 20;

            /*
             * КОНЕЦ:
             * верхний угол ворот.
             *
             * Раньше было 18%, из-за этого мяч
             * улетал выше ворот.
             */
            const endX = pitchWidth * 0.89;
            const endY = pitchHeight * 0.40;

            /* Отключаем старую CSS-анимацию */
            matchBall.style.animation = "none";

            /* Сбрасываем старое положение */
            matchBall.style.left = `${startX}px`;
            matchBall.style.top = `${startY}px`;
            matchBall.style.transform = "translate(0, 0) scale(1) rotate(0deg)";

            /*
             * Небольшая пауза, чтобы браузер
             * точно применил начальную позицию
             */
            void matchBall.offsetWidth;

            const duration = 1400;
            const startTime = performance.now();

            function animateBall(currentTime) {

                const elapsed = currentTime - startTime;

                let progress = elapsed / duration;

                if (progress > 1) {
                    progress = 1;
                }

                /*
                 * Плавное ускорение → замедление
                 */
                const eased = 1 - Math.pow(1 - progress, 3);

                /*
                 * Основное движение
                 */
                const x = startX + (endX - startX) * eased;

                /*
                 * Дуга полёта.
                 *
                 * 0.08 — специально уменьшено,
                 * чтобы мяч не перелетал над воротами.
                 */
                const arc =
                    -Math.sin(progress * Math.PI) *
                    pitchHeight *
                    0.08;

                const y =
                    startY +
                    (endY - startY) * eased +
                    arc;

                /*
                 * Мяч постепенно уменьшается вдали
                 */
                const scale = 1 - progress * 0.4;

                /*
                 * Вращение мяча
                 */
                const rotation = progress * 1200;

                matchBall.style.left = `${x}px`;
                matchBall.style.top = `${y}px`;

                matchBall.style.transform =
                    `translate(0, 0) scale(${scale}) rotate(${rotation}deg)`;

                if (progress < 1) {
                    requestAnimationFrame(animateBall);
                } else {

                    /*
                     * Когда мяч попал в угол —
                     * запускаем остальные анимации
                     */
                    goalSection.classList.add("goal-scored");

                    /*
                     * Через несколько секунд
                     * возвращаем всё в исходное состояние
                     */
                    setTimeout(() => {

                        goalSection.classList.remove("goal-scored");

                        matchBall.style.animation = "none";

                        matchBall.style.left = `${startX}px`;
                        matchBall.style.top = `${startY}px`;

                        matchBall.style.transform =
                            "translate(0, 0) scale(1) rotate(0deg)";

                    }, 4000);
                }
            }

            requestAnimationFrame(animateBall);
        }


        goalButton.addEventListener("click", shootBall);
    }


    /* =====================================================
       3. КАРТОЧКИ ИГРОКОВ
       ===================================================== */

    const playerCards = document.querySelectorAll(".player-card");

    playerCards.forEach((card) => {

        card.addEventListener("click", () => {

            card.classList.toggle("active");

        });

    });


    /* =====================================================
       4. ТАКТИКА
       ===================================================== */

    const tacticSteps = document.querySelectorAll(".tactic-step");

    tacticSteps.forEach((step, index) => {

        step.style.transitionDelay = `${index * 0.12}s`;

    });


    /* =====================================================
       5. СЛУЧАЙНОЕ СОБЫТИЕ
       ===================================================== */

    const randomButton = document.querySelector("#randomEventButton");
    const randomEventText = document.querySelector("#randomEvent");

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
                Math.floor(Math.random() * events.length);

            randomEventText.textContent =
                events[randomIndex];

            randomEventText.classList.remove("event-pop");

            void randomEventText.offsetWidth;

            randomEventText.classList.add("event-pop");

        });

    }


    /* =====================================================
       6. RIPPLE-ЭФФЕКТ КНОПОК
       ===================================================== */

    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {

        button.addEventListener("click", function (event) {

            const ripple = document.createElement("span");

            ripple.classList.add("ripple");

            const rect = this.getBoundingClientRect();

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

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

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

                    if (!entry.isIntersecting) return;

                    const element = entry.target;

                    const target =
                        parseInt(
                            element.dataset.value ||
                            element.textContent ||
                            "0",
                            10
                        );

                    if (isNaN(target)) return;

                    let current = 0;

                    const duration = 1000;

                    const start =
                        performance.now();

                    function countAnimation(time) {

                        const progress =
                            Math.min(
                                (time - start) / duration,
                                1
                            );

                        current =
                            Math.floor(
                                target *
                                (1 -
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

    document.body.classList.add("page-loaded");

});
