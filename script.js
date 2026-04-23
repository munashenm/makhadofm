// Makhado FM - Premium Script
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const radioStream = document.getElementById('radio-stream');
    const playBtn = document.getElementById('master-play');
    const playIcon = playBtn ? playBtn.querySelector('i') : null;
    const volumeSlider = document.querySelector('input[type="range"]');

    // --- Header Scroll Logic ---
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- Premium Scroll Animations (Reveal on Scroll) ---
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Apply reveal class to sections and cards
    document.querySelectorAll('.section, .schedule-card, .news-card, .dj-card, .gallery-item').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
        revealObserver.observe(el);
    });

    // Custom CSS for revealed state (injected via JS for simplicity or added to CSS)
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- Player Logic ---
    let isPlaying = false;

    window.togglePlayer = () => {
        if (isPlaying) {
            radioStream.pause();
            if (playIcon) playIcon.classList.replace('fa-pause', 'fa-play');
            isPlaying = false;
            playBtn.style.animation = "none";
        } else {
            // Re-load stream to avoid lag
            radioStream.load();
            radioStream.play().then(() => {
                if (playIcon) playIcon.classList.replace('fa-play', 'fa-pause');
                isPlaying = true;
                playBtn.style.animation = "pulse 2s infinite";
            }).catch(error => {
                console.error("Playback failed:", error);
                alert("Stream currently unavailable. Please try again later.");
            });
        }
    };

    // --- Volume Control ---
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            radioStream.volume = volume;
        });
    }

    // --- Mobile Menu Toggle (Premium) ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('open');
            
            // Dynamic styling for mobile menu
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'fixed';
                navLinks.style.inset = '0';
                navLinks.style.background = 'var(--bg-main)';
                navLinks.style.justifyContent = 'center';
                navLinks.style.alignItems = 'center';
                navLinks.style.zIndex = '999';
                navLinks.style.padding = '2rem';
                document.body.style.overflow = 'hidden';
            } else {
                navLinks.style.display = '';
                document.body.style.overflow = '';
            }
        });
    }

    // --- Dynamic Show Display ---
    const updateCurrentShow = () => {
        const now = new Date();
        const hour = now.getHours();
        const currentShowText = document.getElementById('current-show');
        if (!currentShowText) return;

        let showName = "Night Owls Mix";
        if (hour >= 6 && hour < 9) showName = "The Morning Rise";
        else if (hour >= 9 && hour < 12) showName = "Community Pulse";
        else if (hour >= 12 && hour < 15) showName = "The Midday Groove";
        else if (hour >= 15 && hour < 18) showName = "Drive Time Live";
        else if (hour >= 18 && hour < 21) showName = "Evening Reflections";

        if (currentShowText.textContent !== showName) {
            currentShowText.style.opacity = "0";
            setTimeout(() => {
                currentShowText.textContent = showName;
                currentShowText.style.opacity = "1";
            }, 300);
        }
    };

    updateCurrentShow();
    setInterval(updateCurrentShow, 60000);

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        const savedTheme = localStorage.getItem('theme');
        
        const updateThemeUI = (isDark) => {
            if (isDark) {
                body.classList.add('dark-mode');
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                body.classList.remove('dark-mode');
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        };

        if (savedTheme === 'dark') updateThemeUI(true);

        themeToggle.addEventListener('click', () => {
            const isDark = !body.classList.contains('dark-mode');
            updateThemeUI(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // --- Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    mobileBtn.click();
                }
            }
        });
    });

    // --- Shout-out System ---
    window.sendShoutout = () => {
        const name = prompt("What's your name?");
        if (!name) return;
        const message = prompt(`Hi ${name}, enter your shout-out or song request:`);
        if (message) {
            alert(`Thanks ${name}! Your request has been queued for the DJ.`);
        }
    };

    // --- PWA Support ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('PWA active'))
                .catch(err => console.log('PWA error', err));
        });
    }
});
