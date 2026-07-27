/* -------------------------------------------------------------
   UNBOUND '26 - Interactive Web Logic
   Developed for FOSS Club PU
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 0. THEME MANAGEMENT (DARK / LIGHT MODE)
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved preference, defaulting strictly to dark mode
    const savedTheme = localStorage.getItem('unbound_theme');
    const initialTheme = savedTheme || 'dark';

    // Initialize theme
    setTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('unbound_theme', theme);
        
        if (themeToggleBtn) {
            if (theme === 'dark') {
                themeToggleBtn.textContent = '☀';
                themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
            } else {
                themeToggleBtn.textContent = '☾';
                themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
            }
        }
    }

    // -------------------------------------------------------------
    // 1. COUNTDOWN TIMER
    // -------------------------------------------------------------
    const targetKickoff = new Date('June 12, 2026 00:00:00 GMT+0530').getTime();
    const targetSubmissions = new Date('June 26, 2026 23:59:59 GMT+0530').getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownTitleEl = document.querySelector('.countdown-title');
    const countdownDateEl = document.querySelector('.countdown-date');

    function updateCountdown() {
        const now = new Date().getTime();
        let difference = targetKickoff - now;
        let phase = 'kickoff';

        if (difference < 0) {
            // Kickoff passed, count down to submissions close
            difference = targetSubmissions - now;
            phase = 'submissions';
        }

        if (difference < 0) {
            // Submissions close passed, hackathon concluded
            if (countdownTitleEl) countdownTitleEl.textContent = 'HACKATHON CONCLUDED';
            if (countdownDateEl) countdownDateEl.textContent = 'SUBMISSIONS CLOSED ON JUNE 26, 2026';
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        if (phase === 'submissions') {
            if (countdownTitleEl) countdownTitleEl.textContent = 'COUNTDOWN TO SUBMISSIONS CLOSE';
            if (countdownDateEl) countdownDateEl.textContent = 'DEADLINE: JUNE 26, 2026 (11:59 PM IST)';
        } else {
            if (countdownTitleEl) countdownTitleEl.textContent = 'COUNTDOWN TO KICKOFF';
            if (countdownDateEl) countdownDateEl.textContent = 'KICKOFF DATE: JUNE 12, 2026 (00:00 AM IST)';
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    // Run countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);


    // -------------------------------------------------------------
    // 2. ACCORDION FAQs & CONDUCT
    // -------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close other accordions in the list for clean UX
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    const panel = otherHeader.nextElementSibling;
                    panel.style.maxHeight = null;
                    const icon = otherHeader.querySelector('.accordion-icon');
                    if (icon) icon.textContent = '+';
                }
            });

            // Toggle active accordion
            this.setAttribute('aria-expanded', !isExpanded);
            const panel = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');

            if (!isExpanded) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
                if (icon) icon.textContent = '−';
            } else {
                panel.style.maxHeight = null;
                if (icon) icon.textContent = '+';
            }
        });
    });


    // -------------------------------------------------------------
    // 3. PROJECT READINESS CHECKLIST
    // -------------------------------------------------------------
    const checklistIds = [
        'check-eligibility',
        'check-license',
        'check-dependencies',
        'check-commits',
        'check-attribution',
        'check-readme',
        'check-video'
    ];

    const progressBar = document.getElementById('checklist-progress');
    const checklistCount = document.getElementById('checklist-count');
    const checklistPct = document.getElementById('checklist-pct');
    const statusVerdict = document.getElementById('status-verdict');

    // Load initial state
    checklistIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            const savedState = localStorage.getItem(`unbound_${id}`);
            checkbox.checked = savedState === 'true';
            checkbox.addEventListener('change', handleChecklistChange);
        }
    });

    function handleChecklistChange() {
        let checkedCount = 0;
        
        checklistIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                localStorage.setItem(`unbound_${id}`, checkbox.checked);
                if (checkbox.checked) {
                    checkedCount++;
                }
            }
        });

        const totalItems = checklistIds.length;
        const percentage = Math.round((checkedCount / totalItems) * 100);

        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (checklistCount) checklistCount.textContent = checkedCount;
        if (checklistPct) checklistPct.textContent = `${percentage}%`;

        if (statusVerdict) {
            if (checkedCount === totalItems) {
                statusVerdict.textContent = '✦ PROJECT FULLY COMPLIANT & READY ✦';
                statusVerdict.classList.add('compliant');
            } else {
                statusVerdict.textContent = 'PROJECT NOT YET COMPLIANT';
                statusVerdict.classList.remove('compliant');
            }
        }
    }

    // Trigger initial progress bar render
    handleChecklistChange();

});

// -------------------------------------------------------------
// 4. CERTIFICATE LIGHTBOX MODAL HANDLER
// -------------------------------------------------------------
function openCertificateModal(imgSrc, caption) {
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');

    if (modal && modalImg) {
        modalImg.src = imgSrc;
        if (modalCaption) modalCaption.textContent = caption || '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCertificateModal(e) {
    if (e) e.stopPropagation();
    const modal = document.getElementById('certificate-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertificateModal();
    }
});

