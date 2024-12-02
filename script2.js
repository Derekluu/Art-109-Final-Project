document.addEventListener('DOMContentLoaded', () => {
    const imgElement = document.getElementById('animation');
    const images = [
        { src: 'Assets/bite1.png', duration: 1000 },
        { src: 'Assets/bite2.png', duration: 100 },
        { src: 'Assets/bite3.png', duration: 100 },
        { src: 'Assets/bite4.png', duration: 100 },
        { src: 'Assets/bite5.png', duration: 100 },
        { src: 'Assets/bite6.png', duration: 100 },
        { src: 'Assets/bite7.png', duration: 100 },
        { src: 'Assets/bite8.png', duration: 100 },
        { src: 'Assets/bite9.png', duration: 100 },
        { src: 'Assets/bite10.png', duration: 3000 },
        { src: 'Assets/bite10.png', duration: 5000 }
    ];

    let currentImageIndex = 0;

    // Preload all images
    function preloadImages(imageArray, callback) {
        let loadedImages = 0;

        imageArray.forEach(image => {
            const img = new Image();
            img.src = image.src;
            img.onload = () => {
                loadedImages++;
                if (loadedImages === imageArray.length) {
                    callback(); // Start animation when all images are preloaded
                }
            };
        });
    }

    function playAnimation() {
        const { src, duration } = images[currentImageIndex];
        imgElement.src = src;

        currentImageIndex++;

        if (currentImageIndex < images.length) {
            setTimeout(playAnimation, duration); // Schedule next image
        } else {
            // Redirect after the last image
            window.location.href = "home.html"; // Replace with your desired URL
        }
    }

    // Start preloading images and then play the animation
    preloadImages(images, playAnimation);
});
