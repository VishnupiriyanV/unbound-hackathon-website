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


    // -------------------------------------------------------------
    // 4. TEAM REGISTRATION PLANNER & TICKET GENERATOR
    // -------------------------------------------------------------
    const membersContainer = document.getElementById('members-container');
    const addMemberBtn = document.getElementById('add-member-btn');
    const formEl = document.getElementById('registration-planner-form');
    const resetBtn = document.getElementById('reset-planner-btn');
    const ticketOutputContainer = document.getElementById('ticket-output-container');
    const ticketBody = document.getElementById('ticket-body');
    const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
    const downloadTicketBtn = document.getElementById('download-ticket-btn');

    let memberCount = 1;
    const MAX_MEMBERS = 4;

    addMemberBtn.addEventListener('click', () => {
        if (memberCount >= MAX_MEMBERS) {
            alert('A team can consist of at most 4 members.');
            return;
        }

        memberCount++;
        const newMemberDiv = document.createElement('div');
        newMemberDiv.className = 'member-entry';
        newMemberDiv.setAttribute('data-member-index', memberCount);
        newMemberDiv.innerHTML = `
            <div class="member-header">
                <span class="member-number">#${memberCount}: Team Member</span>
                <button type="button" class="remove-member-btn" onclick="removeMember(${memberCount})">Remove</button>
            </div>
            <div class="member-fields">
                <div class="field-item">
                    <input type="text" class="m-name" placeholder="Full Name" required>
                </div>
                <div class="field-item">
                    <input type="email" class="m-email" placeholder="Email Address" required>
                </div>
                <div class="field-item">
                    <input type="text" class="m-college" placeholder="College / Institution" required>
                </div>
                <div class="field-item">
                    <input type="text" class="m-github" placeholder="GitHub Username" required>
                </div>
            </div>
        `;
        membersContainer.appendChild(newMemberDiv);
        
        // Hide add button if limit reached
        if (memberCount === MAX_MEMBERS) {
            addMemberBtn.style.display = 'none';
        }
    });

    // Global window scoped remove function so inline onclick works easily
    window.removeMember = function(index) {
        const memberEl = document.querySelector(`.member-entry[data-member-index="${index}"]`);
        if (memberEl) {
            memberEl.remove();
            memberCount--;
            
            // Re-index remaining members (excluding leader #1)
            const entries = membersContainer.querySelectorAll('.member-entry');
            let idx = 1;
            entries.forEach(entry => {
                entry.setAttribute('data-member-index', idx);
                const numberLabel = entry.querySelector('.member-number');
                if (idx === 1) {
                    numberLabel.textContent = `#1: Team Leader`;
                } else {
                    numberLabel.textContent = `#${idx}: Team Member`;
                    // Update the remove button's index
                    const removeBtn = entry.querySelector('.remove-member-btn');
                    if (removeBtn) {
                        removeBtn.setAttribute('onclick', `removeMember(${idx})`);
                    }
                }
                idx++;
            });
            
            memberCount = entries.length;

            // Re-show add button if below max
            if (memberCount < MAX_MEMBERS) {
                addMemberBtn.style.display = 'inline-flex';
            }
        }
    };

    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        const teamName = document.getElementById('team-name').value.trim();
        const projectLicense = document.getElementById('project-license').value;
        const projectDesc = document.getElementById('project-description').value.trim();

        // Collect members
        const memberEntries = membersContainer.querySelectorAll('.member-entry');
        const membersData = [];
        const emails = new Set();
        let duplicateFound = false;

        memberEntries.forEach(entry => {
            const name = entry.querySelector('.m-name').value.trim();
            const email = entry.querySelector('.m-email').value.trim();
            const college = entry.querySelector('.m-college').value.trim();
            const github = entry.querySelector('.m-github').value.trim().replace(/^@/, ''); // Strip leading @ if present

            if (emails.has(email.toLowerCase())) {
                duplicateFound = true;
            }
            emails.add(email.toLowerCase());

            membersData.push({ name, email, college, github });
        });

        if (duplicateFound) {
            alert('Validation Error: Email addresses must be unique. Each participant can only be registered once.');
            return;
        }

        // Generate Ticket Markdown
        const dateString = new Date().toLocaleString();
        let markdown = `========================================================\n`;
        markdown += `           UNBOUND '26 REGISTRATION TICKET\n`;
        markdown += `========================================================\n`;
        markdown += `Generated On      : ${dateString}\n`;
        markdown += `Team Name         : ${teamName}\n`;
        markdown += `Chosen License    : ${projectLicense} (OSI Approved)\n`;
        if (projectDesc) {
            markdown += `Project Concept   : ${projectDesc}\n`;
        }
        markdown += `Team Composition  : ${membersData.length} member(s)\n`;
        markdown += `--------------------------------------------------------\n\n`;

        membersData.forEach((member, i) => {
            const role = i === 0 ? "Team Leader" : `Member #${i + 1}`;
            markdown += `[${role}]\n`;
            markdown += `- Name   : ${member.name}\n`;
            markdown += `- Email  : ${member.email}\n`;
            markdown += `- College: ${member.college}\n`;
            markdown += `- GitHub : https://github.com/${member.github}\n\n`;
        });

        markdown += `--------------------------------------------------------\n`;
        markdown += `FOSS STATUTES COMPLIANCE ACKNOWLEDGED:\n`;
        markdown += `[✓] Strictly Open Source (OSI Approved LICENSE file)\n`;
        markdown += `[✓] Core development active only June 12 - June 26, 2026\n`;
        markdown += `[✓] Clear public commits (No Ghost Pushes)\n`;
        markdown += `[✓] Zero proprietary/paid dependency lock-in\n`;
        markdown += `========================================================\n`;
        markdown += `Save this ticket. Paste the contents into the official\n`;
        markdown += `FOSS CLUB PU Discord registration channel or form.\n`;
        markdown += `========================================================`;

        // Render ticket
        ticketBody.textContent = markdown;
        ticketOutputContainer.classList.remove('hidden');

        // Scroll to ticket container smoothly
        ticketOutputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Copy to clipboard
    copyMarkdownBtn.addEventListener('click', () => {
        const text = ticketBody.textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Ticket copied to clipboard!');
            })
            .catch(err => {
                alert('Failed to copy ticket to clipboard. Please select the text manually.');
                console.error(err);
            });
    });

    // Download text ticket
    downloadTicketBtn.addEventListener('click', () => {
        const text = ticketBody.textContent;
        const teamName = document.getElementById('team-name').value.trim() || 'team';
        const filename = `${teamName.toLowerCase().replace(/\s+/g, '_')}_unbound_ticket.txt`;
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // Reset Form
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all form fields?')) {
            formEl.reset();
            // Remove additional members, keeping only the leader
            const entries = membersContainer.querySelectorAll('.member-entry');
            entries.forEach((entry, index) => {
                if (index > 0) {
                    entry.remove();
                }
            });
            memberCount = 1;
            addMemberBtn.style.display = 'inline-flex';
            ticketOutputContainer.classList.add('hidden');
        }
    });
});
