document.addEventListener('DOMContentLoaded', () => {

    // --- INTRO ANIMATION CONTROLLER ---
    const introOverlay = document.getElementById('intro-overlay');
    const introSound = document.getElementById('intro-sound');
    const skipBtn = document.getElementById('skip-btn');
    const heroContent = document.querySelector('.hero-content');

    // Check Session Storage (Play once per session)
    // If 'introShown' is present, skip the intro immediately
    // Check Session Storage (Play once per session)
    // DISABLED FOR TESTING: We want it to play every time now
    // const hasSeenIntro = sessionStorage.getItem('introShown');

    // if (hasSeenIntro) {
    //     introOverlay.style.display = 'none'; 
    //     heroContent.classList.add('fade-in'); 
    // } else {
    // Play Intro (Always Attempt)
    runIntro();
    // }

    function runIntro() {
        // Attempt to play sound (Graceful Fail)
        const playPromise = introSound.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // If blocked (Autoplay Policy), we just log it and proceed silently
                console.log("Autoplay prevented by browser policy.");
                // Fallback: Play on any first interaction
                const enableAudio = () => {
                    introSound.play().catch(() => { });
                    document.removeEventListener('click', enableAudio);
                    document.removeEventListener('keydown', enableAudio);
                    document.removeEventListener('touchstart', enableAudio);
                };
                document.addEventListener('click', enableAudio);
                document.addEventListener('keydown', enableAudio);
                document.addEventListener('touchstart', enableAudio);
            });
        }

        // Set Timer for end of animation (3.5s match CSS)
        const animationDuration = 3500;

        const finishTimer = setTimeout(() => {
            finishIntro();
        }, animationDuration);

        // Skip Button Logic
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                clearTimeout(finishTimer);
                try {
                    introSound.pause();
                    introSound.currentTime = 0;
                } catch (e) { /* ignore */ }
                finishIntro();
            });
        }
    }

    function finishIntro() {
        introOverlay.classList.add('hidden');
        sessionStorage.setItem('introShown', 'true');

        // Trigger Main Hero Animation
        heroContent.classList.add('fade-in');

        // Stop sound just in case
        setTimeout(() => {
            introOverlay.style.display = 'none'; // Optimize performance
        }, 800);
    }


    // --- Navbar Background on Scroll ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Section Reveal Animation ---
    const revealSections = document.querySelectorAll('.row-section');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15 // Trigger when 15% visible
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // --- Row Scroll Handles ---
    document.querySelectorAll('.row-container').forEach(container => {
        const row = container.querySelector('.row');
        const leftHandle = container.querySelector('.left-handle');
        const rightHandle = container.querySelector('.right-handle');

        if (!leftHandle || !rightHandle) return;

        leftHandle.addEventListener('click', () => {
            const scrollAmount = window.innerWidth * 0.7; // Scroll 70% of screen width
            row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        rightHandle.addEventListener('click', () => {
            const scrollAmount = window.innerWidth * 0.7;
            row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    });

    // --- Optional: Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
