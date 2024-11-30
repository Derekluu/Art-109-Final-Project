document.addEventListener('DOMContentLoaded', () => {
    const character = document.querySelector('.character');
    const links = document.querySelectorAll('.link');

    let x = window.innerWidth / 2 - 25; // Initial X position
    let y = window.innerHeight / 2 - 25; // Initial Y position
    const step = 8; // Horizontal movement step in pixels
    const gravity = 1; // Gravity force (in pixels per frame)
    const jumpStrength = -30; // Jump strength (negative for upward movement)
    let velocityY = 0; // Current vertical velocity
    const keys = {}; // Object to track pressed keys
    const groundLevel = window.innerHeight+5; // aPosition of the ground (bottom of the screen)



    
    // Set the initial position
    character.style.left = `${x}px`;
    character.style.top = `${y}px`;

    // Check for collision between character and links
    function checkCollision() {
        const charRect = character.getBoundingClientRect();

        links.forEach(link => {
            const linkRect = link.getBoundingClientRect();

            // Check if the rectangles overlap
            if (
                charRect.left < linkRect.right &&
                charRect.right > linkRect.left &&
                charRect.top < linkRect.bottom &&
                charRect.bottom > linkRect.top
            ) {
                // Navigate to the link's URL
                window.location.href = link.dataset.link;
            }
        });
    }

    // Handle gravity and movement
    function updatePosition() {
        // Apply gravity to vertical velocity
        velocityY += gravity;

        // Update Y position based on velocity
        y += velocityY;

        // Check if character hits the ground
        if (y > groundLevel) {
            y = groundLevel; // Reset position to ground level
            velocityY = 0; // Stop downward movement
        }

        // Check for jumping
        if (keys['w'] && y === groundLevel) {
            console.log('jump')
            velocityY = jumpStrength; // Apply upward velocity
        }

        // Handle horizontal movement
        if (keys['a']) {
            x = Math.max(33, x - step); // Move left
        }
        if (keys['d']) {
            x = Math.min(window.innerWidth - 32, x + step); // Move right
        }

        // Update character position
        character.style.left = `${x}px`;
        character.style.top = `${y}px`;

        // Check for collision
        checkCollision();
    }

    // Listen for keydown events to mark keys as active
    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    // Listen for keyup events to mark keys as inactive
    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    // Continuously update the game state
    function gameLoop() {
        updatePosition();
        requestAnimationFrame(gameLoop);
    }

    gameLoop(); // Start the game loop
});
