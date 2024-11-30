document.addEventListener('DOMContentLoaded', () => {
    const imgElement = document.getElementById('animation');
    const images = [
        { src: 'Assets/bite1.png', duration: 5000 },
        { src: 'Assets/bite2.png', duration: 100 },
        { src: 'Assets/bite3.png', duration: 100 },
        { src: 'Assets/bite4.png', duration: 100 },
        { src: 'Assets/bite5.png', duration: 100 },
        { src: 'Assets/bite6.png', duration: 100 },
        { src: 'Assets/bite7.png', duration: 100 },
        { src: 'Assets/bite8.png', duration: 100 },
        { src: 'Assets/bite9.png', duration: 100 },
        { src: 'Assets/bite10.png', duration: 5000 }
    ];

    let currentImageIndex = 0;

    function playAnimation() {
        const { src, duration } = images[currentImageIndex];
        imgElement.src = src;

        currentImageIndex++;

        if (currentImageIndex < images.length) {
            setTimeout(playAnimation, duration); // Schedule next image
        } else {
            // Redirect after the last image
            window.location.href = "index.html"; // Replace with your desired URL
        }
    }

    playAnimation(); // Start the animation
});
