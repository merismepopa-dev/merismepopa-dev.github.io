// security.js - Enhanced Security Module for Tech et Style
class SecurityManager {
    constructor() {
        this.config = {
            maxFailedAttempts: 5,
            lockoutDuration: 5 * 60 * 1000, // 5 minutes
            inactivityTimeout: 15 * 60 * 1000, // 15 minutes
            maxInputLength: 500,
        };
        this.state = {
            failedAttempts: 0,
            lastActivity: Date.now(),
        };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.forceHTTPS();
            this.secureExternalLinks();
            this.obfuscateEmails();
            this.setupActivityMonitor();
            this.logPageVisit();
            console.log('🔒 SecurityManager initialized for Tech et Style');
        });
        this.detectDevTools();
    }

    forceHTTPS() {
        if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
            console.warn('Connection is not secure. Redirection vers HTTPS.');
            location.href = 'https://' + location.hostname + location.pathname + location.search + location.hash;
        }
    }

    secureExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (link.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                // Accessibilité : description pour les liens externes
                if (!link.hasAttribute('aria-label')) {
                    link.setAttribute('aria-label', 'Lien externe vers ' + link.hostname);
                }
            }
        });
    }

    obfuscateEmails() {
        document.querySelectorAll('[data-email]').forEach(el => {
            const emailUser = 'contact';
            const domain = 'techetstyle.ht';
            const email = `${emailUser}@${domain}`;
            if (el.tagName === 'A') {
                el.href = 'mailto:' + email;
                el.setAttribute('aria-label', 'Envoyer un mail à ' + email);
            }
            el.textContent = email;
        });
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        const sanitized = input.substring(0, this.config.maxInputLength);
        const tempDiv = document.createElement('div');
        tempDiv.textContent = sanitized;
        return tempDiv.innerHTML;
    }

    setupActivityMonitor() {
        const activities = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];
        activities.forEach(event => {
            document.addEventListener(event, () => {
                this.state.lastActivity = Date.now();
            }, { passive: true });
        });

        setInterval(() => {
            if (Date.now() - this.state.lastActivity > this.config.inactivityTimeout) {
                SecurityLogger.log('user_inactive', { timeout: this.config.inactivityTimeout });
            }
        }, 60000);
    }

    logFailedAttempt(context) {
        this.state.failedAttempts++;
        SecurityLogger.log('failed_attempt', { context, count: this.state.failedAttempts });

        if (this.state.failedAttempts >= this.config.maxFailedAttempts) {
            SecurityLogger.log('lockout_triggered', { duration: this.config.lockoutDuration });
            setTimeout(() => {
                this.state.failedAttempts = 0;
                SecurityLogger.log('lockout_lifted');
            }, this.config.lockoutDuration);
        }
    }

    detectDevTools() {
        const threshold = 160;
        const check = () => {
            const devtools_opened = window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold;
            if (devtools_opened) {
                SecurityLogger.log('devtools_opened');
                // Optionnel : afficher un avertissement
                // alert('Attention : Les outils de développement sont ouverts.');
            }
        };
        setInterval(check, 1000);
    }

    logPageVisit() {
        SecurityLogger.log('page_visit', {
            path: window.location.pathname,
            referrer: document.referrer || 'direct',
        });
    }
}

class SecurityLogger {
    static log(event, data = {}) {
        try {
            const logs = JSON.parse(localStorage.getItem('securityLogs_ts') || '[]');
            const logEntry = {
                timestamp: new Date().toISOString(),
                event,
                data,
                url: window.location.href,
            };
            logs.push(logEntry);
            if (logs.length > 100) logs.shift();
            localStorage.setItem('securityLogs_ts', JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to write to SecurityLogger.', e);
        }
    }
}

const securityManager = new SecurityManager();