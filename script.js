document.addEventListener('DOMContentLoaded', () => {
    const character = document.querySelector('.character');
    const links = document.querySelectorAll('.link');
    const platforms = document.querySelectorAll('.platform-zone');
    
    let x = window.innerWidth / 2 - 25;  // Initial X position
    let y = window.innerHeight / 2 - 25; // Initial Y position
    const step = 8; // Horizontal movement step in pixels
    let gravity = 1; // Gravity force (in pixels per frame)
    let jumpStrength = -25; // Jump strength (negative for upward movement)
    let velocityY = 0; // Current vertical velocity
    const keys = {}; // Object to track pressed keys
    let onGround = false; // To check if character is on a platform or ground

    const groundLevel = document.documentElement.scrollHeight - character.offsetHeight;
    document.body.style.height = `${document.documentElement.scrollHeight}px`;

    const url = window.location.pathname;
    // Set spawn positions based on page URL
    if (url.includes("page1.html")) {
        x = 800;
        y = 100;
    } else if (url.includes("page2.html")) {
        x = 300;
        y = 400;
    } else if (url.includes("home.html")) {
        x = 100;
        y = 100;
    } else {
        x = window.innerWidth / 2 - 25;
        y = window.innerHeight / 2 - 25;
    }

    // Set the initial position
    character.style.left = `${x}px`;
    character.style.top = `${y}px`;

    // Check for collision with links
    function checkCollisionWithLinks() {
        const charRect = character.getBoundingClientRect();
        links.forEach(link => {
            const linkRect = link.getBoundingClientRect();
            if (
                charRect.left < linkRect.right &&
                charRect.right > linkRect.left &&
                charRect.top < linkRect.bottom &&
                charRect.bottom > linkRect.top
            ) {
                window.location.href = link.dataset.link;
            }
        });
    }

    // Check for collision with platforms
    function checkCollisionWithPlatforms() {
        onGround = false;

        platforms.forEach(platform => {
            const platformTop = platform.offsetTop;
            const platformBottom = platformTop + platform.offsetHeight;
            const platformLeft = platform.offsetLeft;
            const platformRight = platformLeft + platform.offsetWidth;

            const characterTop = y;
            const characterBottom = y + character.offsetHeight;
            const characterLeft = x - 30;
            const characterRight = x + character.offsetWidth - 70;

            if (
                characterRight > platformLeft &&
                characterLeft < platformRight &&
                characterBottom <= platformTop + velocityY &&
                characterBottom + velocityY >= platformTop &&
                velocityY >= 0
            ) {
                y = platformTop - character.offsetHeight;
                velocityY = 0;
                onGround = true;
            }

            if (
                characterRight > platformLeft &&
                characterLeft < platformRight &&
                characterTop >= platformBottom + velocityY &&
                characterTop + velocityY <= platformBottom &&
                velocityY < 0
            ) {
                y = platformBottom;
                velocityY = 1;
            }

            if (
                characterBottom > platformTop &&
                characterTop < platformBottom &&
                characterRight > platformLeft &&
                characterLeft < platformLeft &&
                characterRight - step <= platformLeft
            ) {
                x = platformLeft - character.offsetWidth + 70;
            }

            if (
                characterBottom > platformTop &&
                characterTop < platformBottom &&
                characterLeft < platformRight &&
                characterRight > platformRight &&
                characterLeft + step >= platformRight
            ) {
                x = platformRight + 30;
            }
        });
    }

    // Handle gravity and movement
    function updatePosition() {
        if (!onGround) velocityY += gravity;
        y += velocityY;

        if (y >= groundLevel) {
            y = groundLevel;
            velocityY = 0;
            onGround = true;
        }

        if ((keys['w'] || keys['W']) && onGround) {
            velocityY = jumpStrength;
            onGround = false;
        }

        if (keys['a'] || keys['A']) x = Math.max(30, x - step);
        if (keys['d'] || keys['D']) x = Math.min(window.innerWidth - 30, x + step);

        character.style.left = `${x}px`;
        character.style.top = `${y}px`;

        checkCollisionWithLinks();
        checkCollisionWithPlatforms();

        scrollToKeepCharacterInView();
    }

    function scrollToKeepCharacterInView() {
        const charRect = character.getBoundingClientRect();
        const viewportBottom = window.innerHeight;

        if (charRect.bottom > viewportBottom - 200) {
            window.scrollBy(0, charRect.bottom - viewportBottom + 200);
        }
        if (charRect.top < 300) {
            window.scrollBy(0, charRect.top - 300);
        }
    }

    document.addEventListener('keydown', (event) => keys[event.key] = true);
    document.addEventListener('keyup', (event) => keys[event.key] = false);

    // Setting the target frame rate (e.g., 60 FPS)
    const targetFrameRate = 120;
    const targetTimePerFrame = 1000 / targetFrameRate; // Time per frame in milliseconds

    let lastTime = 0;
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;

        if (deltaTime >= targetTimePerFrame) {
            updatePosition();
            lastTime = timestamp; // Update lastTime only when the frame has passed
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop(); // Start the game loop
});
