document.addEventListener('DOMContentLoaded', () => {
    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-button');

    copyButtons.forEach(button => {
        // Add hover sound effect
        button.addEventListener('mouseenter', () => {
            playHoverSound();
            addRippleEffect(button);
        });

        button.addEventListener('click', () => {
            const targetSelector = button.getAttribute('data-clipboard-target');
            const targetElement = document.querySelector(targetSelector);

            if (targetElement) {
                const textToCopy = targetElement.innerText || targetElement.textContent;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Success feedback
                    button.textContent = '已复制!';
                    button.classList.add('copied');
                    playSuccessSound();

                    // Add animation to the card
                    const card = button.closest('.prompt-card');
                    card.style.borderColor = 'var(--success-color)';
                    addPulseEffect(card);

                    setTimeout(() => {
                        card.style.borderColor = '';
                    }, 1000);

                    // Reset button text after a short delay
                    setTimeout(() => {
                        button.textContent = '复制';
                        button.classList.remove('copied');
                    }, 1500); // Reset after 1.5 seconds
                }).catch(err => {
                    console.error('无法复制文本: ', err);
                    // Error feedback to the user
                    button.textContent = '复制失败';
                    playErrorSound();
                    setTimeout(() => {
                        button.textContent = '复制';
                    }, 1500);
                });
            } else {
                console.error('找不到要复制的目标元素:', targetSelector);
                button.textContent = '错误';
                playErrorSound();
                setTimeout(() => {
                    button.textContent = '复制';
                }, 1500);
            }
        });
    });

    // Add card hover effects
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playHoverSound();
            addGlowEffect(card);
        });
    });

    // Add tag hover effects
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            playHoverSound(0.1); // Lower volume for tags
        });
    });

    // Add visual effects to header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 10) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
            }
        });
    }

    // Visual effects functions
    function addRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        // Position the ripple
        const rect = element.getBoundingClientRect();
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = (event.clientX - rect.left - ripple.offsetWidth / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - ripple.offsetHeight / 2) + 'px';

        element.appendChild(ripple);

        // Remove the ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function addGlowEffect(element) {
        // Add a temporary glow effect
        element.style.boxShadow = '0 0 15px rgba(255, 144, 0, 0.3)';
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 300);
    }

    function addPulseEffect(element) {
        // Create and add a pulse element
        const pulse = document.createElement('div');
        pulse.classList.add('pulse-effect');
        element.appendChild(pulse);

        // Remove after animation completes
        setTimeout(() => {
            pulse.remove();
        }, 1000);
    }

    // Sound effects functions
    function playHoverSound(volume = 0.2) {
        // This is just a placeholder - in a real implementation you might want to use actual sound files
        // For now we'll use the Web Audio API to generate a simple sound
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.log('Audio not supported or enabled');
        }
    }

    function playSuccessSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
            oscillator.stop(audioCtx.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported or enabled');
        }
    }

    function playErrorSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
            oscillator.stop(audioCtx.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported or enabled');
        }
    }

    // Add smooth scroll behavior for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation classes to elements on page load
    setTimeout(() => {
        document.querySelectorAll('.role-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 50); // Stagger the animations
        });
    }, 300);
});