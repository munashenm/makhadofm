// Makhado FM - Main Script

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const radioStream = document.getElementById('radio-stream');
    const playBtn = document.getElementById('master-play');
    const playIcon = document.getElementById('play-icon');
    const volumeSlider = document.querySelector('input[type="range"]');

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Player Logic
    let isPlaying = false;

    window.togglePlayer = () => {
        if (isPlaying) {
            radioStream.pause();
            playIcon.classList.replace('fa-pause', 'fa-play');
            isPlaying = false;
        } else {
            // Re-load stream to avoid lag if paused for a long time
            radioStream.load();
            radioStream.play().then(() => {
                playIcon.classList.replace('fa-play', 'fa-pause');
                isPlaying = true;
            }).catch(error => {
                console.error("Playback failed:", error);
                alert("Stream currently unavailable. Please try again later.");
            });
        }
    };

    // Volume Control
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        radioStream.volume = volume;
    });

    // Mobile Menu Toggle (Simplified)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        });
    }

    // Dynamic Show Display (Simple Example)
    const updateCurrentShow = () => {
        const now = new Date();
        const hour = now.getHours();
        const currentShowText = document.getElementById('current-show');

        if (hour >= 6 && hour < 9) currentShowText.textContent = "The Morning Rise";
        else if (hour >= 9 && hour < 12) currentShowText.textContent = "Community Pulse";
        else if (hour >= 12 && hour < 15) currentShowText.textContent = "The Midday Groove";
        else if (hour >= 15 && hour < 18) currentShowText.textContent = "Drive Time Live";
        else if (hour >= 18 && hour < 21) currentShowText.textContent = "Evening Reflections";
        else currentShowText.textContent = "Night Owls Mix";
    };

    updateCurrentShow();
    setInterval(updateCurrentShow, 60000); // Update every minute

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle) {
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (isDark) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // Shout-out System (Demo)
    window.sendShoutout = () => {
        const message = prompt("Enter your shout-out or song request:");
        if (message) {
            alert("Your message has been sent to the DJ! Keep listening.");
        }
    };

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you for your message! Our team will get back to you shortly.");
            contactForm.reset();
        });
    }

    // PWA Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker Registered'))
                .catch(err => console.log('Service Worker Registration Failed', err));
        });
    }
});
