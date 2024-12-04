document.addEventListener('DOMContentLoaded', () => {
    const character = document.querySelector('.character');
    const links = document.querySelectorAll('.link');
    const platforms = document.querySelectorAll('.platform-zone');
    //test
    let x = window.innerWidth / 2 - 25;  // Initial X position
    let y = window.innerHeight / 2 - 25; // Initial Y position
    const step = 8; // Horizontal movement step in pixels
    const gravity = 1; // Gravity force (in pixels per frame)
    const jumpStrength = -25; // Jump strength (negative for upward movement)
    let velocityY = 0; // Current vertical velocity
    const keys = {}; // Object to track pressed keys
    let onGround = false; // To check if character is on a platform or ground

    // Make sure to adjust the ground level and body height for scrolling
    const groundLevel = document.documentElement.scrollHeight - character.offsetHeight;
    document.body.style.height = `${document.documentElement.scrollHeight}px`;

    const url = window.location.pathname; // Get the current page's path

    if (url.includes("page1.html")) {
        x = 800; // Spawn coordinates for page1.html
        y = 200;
    } else if (url.includes("page2.html")) {
        x = 300; // Spawn coordinates for page2.html
        y = 400;  
     } else if (url.includes("home.html" || "Home.html")) {
            x = 100; // Spawn coordinates for page2.html
            y = 100;
    } else {
        x = window.innerWidth / 2 - 25; // Default position
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
        onGround = false; // Reset ground status

        platforms.forEach(platform => {
            // Get platform's absolute position
            const platformTop = platform.offsetTop;
            const platformBottom = platformTop + platform.offsetHeight;
            const platformLeft = platform.offsetLeft;
            const platformRight = platformLeft + platform.offsetWidth;

            // Character's absolute position and hitbox dimensions
            const characterTop = y;
            const characterBottom = y + character.offsetHeight;
            const characterLeft = x - 30;
            const characterRight = x + character.offsetWidth - 70;

            // Top collision (landing on platform)
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

            // Bottom collision (hitting the underside of the platform)
            if (
                characterRight > platformLeft &&
                characterLeft < platformRight &&
                characterTop >= platformBottom + velocityY &&
                characterTop + velocityY <= platformBottom &&
                velocityY < 0
            ) {
                y = platformBottom;
                velocityY = 1; // Apply a slight downward force to simulate falling off
            }

            // Left collision (Character's right side collides with platform's left side)
            if (
                characterBottom > platformTop &&
                characterTop < platformBottom &&
                characterRight > platformLeft &&
                characterLeft < platformLeft && // Check if character is on the left of the platform
                characterRight - step <= platformLeft // Check if character's right side will collide with platform's left side
            ) {
                x = platformLeft - character.offsetWidth + 70; // Stop movement and align character to platform
            }

            // Right collision (Character's left side collides with platform's right side)
            if (
                characterBottom > platformTop &&
                characterTop < platformBottom &&
                characterLeft < platformRight &&
                characterRight > platformRight && // Check if character is on the right of the platform
                characterLeft + step >= platformRight // Check if character's left side will collide with platform's right side
            ) {
                x = platformRight + 30; // Stop movement and align character to platform
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

        scrollToKeepCharacterInView(); // Ensure the page scrolls with character
    }

    function scrollToKeepCharacterInView() {
        const charRect = character.getBoundingClientRect();
        const viewportBottom = window.innerHeight;

        if (charRect.bottom > viewportBottom - 200) {
            window.scrollBy(0, charRect.bottom - viewportBottom + 200); // Scroll down
        }
        if (charRect.top < 300) {
            window.scrollBy(0, charRect.top - 300); // Scroll up if needed
        }
    }

    document.addEventListener('keydown', (event) => keys[event.key] = true);
    document.addEventListener('keyup', (event) => keys[event.key] = false);

    function gameLoop() {
        updatePosition();
        requestAnimationFrame(gameLoop);
    }

    gameLoop(); // Start the game loop
});
