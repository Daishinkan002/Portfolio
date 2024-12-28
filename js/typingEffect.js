document.addEventListener("DOMContentLoaded", () => {
    const phrases = [
        "Senior Computer Vision Research Engineer",
        "AI Enthusiast",
        "Passionate about Robots",
        "Innovator",
    ];
    const typingElement = document.getElementById("typing-effect");

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        const currentText = isDeleting
            ? currentPhrase.substring(0, charIndex--)
            : currentPhrase.substring(0, charIndex++);

        typingElement.textContent = currentText;

        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => (isDeleting = true), 1000); // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length; // Move to the next phrase
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
});
