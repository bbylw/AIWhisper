document.addEventListener('DOMContentLoaded', () => {
    // 自动修复提示卡片的ID和复制按钮
    fixPromptCardsAndButtons();

    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-button');

    copyButtons.forEach(button => {
        // Add hover sound effect
        button.addEventListener('mouseenter', () => {
            playHoverSound();
            addRippleEffect(button);
        });

        button.addEventListener('click', () => {
            // 获取目标选择器，如果没有或无效，尝试自动修复
            let targetSelector = button.getAttribute('data-clipboard-target');
            let targetElement = targetSelector ? document.querySelector(targetSelector) : null;

            // 如果找不到目标元素，尝试自动修复
            if (!targetElement) {
                console.warn('找不到复制目标，尝试自动修复...');
                const card = button.closest('.prompt-card');
                if (card) {
                    const preElement = card.querySelector('.prompt-content pre');
                    if (preElement) {
                        // 为pre元素生成唯一ID
                        const uniqueId = generateUniqueId(card);
                        preElement.id = uniqueId;
                        targetSelector = `#${uniqueId}`;
                        button.setAttribute('data-clipboard-target', targetSelector);
                        targetElement = preElement;
                        console.log('自动修复成功，新目标:', targetSelector);
                    }
                }
            }

            if (targetElement) {
                const textToCopy = targetElement.innerText || targetElement.textContent;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Success feedback with enhanced animation
                    button.textContent = '已复制!';
                    button.classList.add('copied');
                    playSuccessSound();

                    // Add animation to the card
                    const card = button.closest('.prompt-card');
                    card.style.borderColor = 'var(--success-color)';
                    addPulseEffect(card);

                    // 显示复制成功的浮动提示
                    showToast('复制成功!', 'success');

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
                    showToast('复制失败: ' + err.message, 'error');
                    setTimeout(() => {
                        button.textContent = '复制';
                    }, 1500);
                });
            } else {
                console.error('找不到要复制的目标元素:', targetSelector);
                button.textContent = '错误';
                playErrorSound();
                showToast('复制失败: 找不到目标元素', 'error');
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

    // 创建Toast容器
    createToastContainer();

    // 自动修复提示卡片的ID和复制按钮函数
    function fixPromptCardsAndButtons() {
        // 获取所有提示卡片
        const promptCards = document.querySelectorAll('.prompt-card');

        // 为每个卡片的pre元素添加唯一ID，并更新对应的复制按钮
        promptCards.forEach((card) => {
            // 获取卡片中的pre元素和复制按钮
            const preElement = card.querySelector('.prompt-content pre');
            const copyButton = card.querySelector('.copy-button');

            if (preElement && copyButton) {
                // 如果pre元素没有ID，生成一个唯一ID
                if (!preElement.id) {
                    const uniqueId = generateUniqueId(card);
                    preElement.id = uniqueId;
                }

                // 更新复制按钮的data-clipboard-target属性
                copyButton.setAttribute('data-clipboard-target', `#${preElement.id}`);
            }
        });

        console.log(`已修复 ${promptCards.length} 个提示卡片的复制功能`);
    }

    // 生成唯一ID的函数
    function generateUniqueId(card) {
        // 获取卡片标题文本，用于生成ID
        const cardTitle = card.querySelector('h3')?.textContent || '';
        // 生成唯一ID（使用标题的英文字符和数字，加上随机数）
        const uniqueId = 'prompt-' +
            cardTitle.toLowerCase()
                .replace(/[^\w\s]/g, '')  // 移除特殊字符
                .replace(/\s+/g, '-')     // 空格替换为连字符
                .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
            + '-' + Math.floor(Math.random() * 1000);

        return uniqueId;
    }

    // 创建Toast容器
    function createToastContainer() {
        // 检查是否已存在容器
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);

            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                #toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                .toast {
                    padding: 10px 15px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    color: white;
                    font-weight: bold;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                }
                .toast.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .toast.success {
                    background-color: var(--success-color);
                    box-shadow: 0 2px 10px rgba(0, 194, 52, 0.3);
                }
                .toast.error {
                    background-color: #ff3b30;
                    box-shadow: 0 2px 10px rgba(255, 59, 48, 0.3);
                }
                .toast.info {
                    background-color: var(--accent-color);
                    box-shadow: 0 2px 10px rgba(255, 144, 0, 0.3);
                }
                .toast-icon {
                    margin-right: 10px;
                    font-size: 18px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 显示Toast通知
    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // 根据类型添加图标
        let icon = '';
        switch (type) {
            case 'success':
                icon = '✓';
                break;
            case 'error':
                icon = '✗';
                break;
            case 'info':
                icon = 'ℹ';
                break;
        }

        toast.innerHTML = `<span class="toast-icon">${icon}</span>${message}`;
        container.appendChild(toast);

        // 显示Toast
        setTimeout(() => toast.classList.add('show'), 10);

        // 定时移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
});