// Theme Management with system preference detection
class ThemeManager {
    constructor() {
        this.themeSwitch = document.getElementById('themeSwitch');
        this.themeLabel = document.getElementById('themeLabel');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.themeText = document.getElementById('themeText');
        this.htmlElement = document.documentElement;
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.bindEvents();
        this.updateToggleButton();
        
        // Listen for system theme changes
        this.systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemThemeQuery.addListener(() => {
            if (!localStorage.getItem('theme')) {
                this.applySystemTheme();
            }
        });
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            this.enableDarkTheme();
        } else if (savedTheme === 'light') {
            this.enableLightTheme();
        } else {
            this.applySystemTheme();
        }
    }
    
    applySystemTheme() {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (systemPrefersDark) {
            this.enableDarkTheme();
        } else {
            this.enableLightTheme();
        }
    }
    
    enableDarkTheme() {
        this.htmlElement.setAttribute('data-theme', 'dark');
        if (this.themeSwitch) this.themeSwitch.checked = true;
        if (this.themeLabel) this.themeLabel.textContent = 'Mode Gelap';
        localStorage.setItem('theme', 'dark');
        this.updateToggleButton();
    }
    
    enableLightTheme() {
        this.htmlElement.setAttribute('data-theme', 'light');
        if (this.themeSwitch) this.themeSwitch.checked = false;
        if (this.themeLabel) this.themeLabel.textContent = 'Mode Terang';
        localStorage.setItem('theme', 'light');
        this.updateToggleButton();
    }
    
    toggleTheme() {
        if (this.htmlElement.getAttribute('data-theme') === 'dark') {
            this.enableLightTheme();
        } else {
            this.enableDarkTheme();
        }
    }
    
    updateToggleButton() {
        if (!this.themeIcon || !this.themeText) return;
        
        const isDark = this.htmlElement.getAttribute('data-theme') === 'dark';
        this.themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        this.themeText.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
    }
    
    bindEvents() {
        if (this.themeSwitch) {
            this.themeSwitch.addEventListener('change', () => this.toggleTheme());
        }
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Notification Manager
class NotificationManager {
    constructor() {
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notificationText');
        this.timeoutId = null;
    }
    
    show(message, duration = 3500) {
        if (!this.notification || !this.notificationText) return;
        
        // Clear any existing timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.notification.style.animation = 'none';
            void this.notification.offsetWidth; // Trigger reflow
        }
        
        this.notificationText.textContent = message;
        this.notification.style.display = 'block';
        
        // Set new timeout
        this.timeoutId = setTimeout(() => {
            this.hide();
        }, duration);
    }
    
    hide() {
        if (!this.notification) return;
        
        this.notification.style.display = 'none';
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

// Clipboard Manager
class ClipboardManager {
    constructor() {
        this.notificationManager = new NotificationManager();
    }
    
    copy(text, successMessage) {
        if (!navigator.clipboard) {
            this.fallbackCopy(text);
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            this.notificationManager.show(successMessage || 'Berhasil disalin!');
        }).catch(() => {
            this.fallbackCopy(text);
        });
    }
    
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.notificationManager.show('Berhasil disalin!');
        } catch (err) {
            this.notificationManager.show('Gagal menyalin, silakan salin manual');
        }
        
        document.body.removeChild(textarea);
    }
}

// QR Modal Manager
class QRModalManager {
    constructor() {
        this.modal = document.getElementById('qrScannerModal');
        this.bindEvents();
    }
    
    show() {
        if (!this.modal) return;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    hide() {
        if (!this.modal) return;
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    bindEvents() {
        if (!this.modal) return;
        
        // Close when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.hide();
            }
        });
    }
}

// Account Formatter
class AccountFormatter {
    static format(number) {
        if (!number) return '';
        
        const cleaned = number.replace(/\D/g, '');
        
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
        } else if (cleaned.length === 12) {
            return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        }
        
        // Default formatting for other lengths
        return cleaned.replace(/(\d{4})/g, '$1 ').trim();
    }
}

// Image Loader with fallback
class ImageLoader {
    static checkImages() {
        const images = [
            'img/Logo-Market.jpg',
            'img/Logo-Qris.jpg',
            'img/Qris.jpg',
            'img/Logo-Bank.jpg',
            'img/Logo-Bca.jpg',
            'img/Logo-Ewallet.jpg',
            'img/Logo-Gopay.jpg',
            'img/Logo-Ovo.jpg',
            'img/Logo-Dana.jpg'
        ];
        
        images.forEach(img => {
            const image = new Image();
            image.onload = () => {
                console.log(`✅ Gambar "${img}" berhasil dimuat`);
            };
            image.onerror = () => {
                console.warn(`⚠️ Gambar "${img}" tidak ditemukan`);
                this.applyFallback(img);
            };
            image.src = img;
        });
    }
    
    static applyFallback(imgSrc) {
        const elements = document.querySelectorAll(`img[src="${imgSrc}"]`);
        const fallbackText = this.getFallbackText(imgSrc);
        
        elements.forEach(el => {
            el.alt = `Gambar tidak tersedia - ${fallbackText}`;
            el.style.border = '2px dashed var(--primary-color)';
            el.style.padding = '10px';
            el.style.backgroundColor = 'rgba(164, 164, 164, 0.1)';
            
            // Create fallback container
            const container = document.createElement('div');
            container.className = 'image-fallback';
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary);">
                    <i class="fas fa-image" style="font-size: 2em; margin-bottom: 8px;"></i>
                    <p style="margin: 0; font-size: 0.9em;">${fallbackText}</p>
                </div>
            `;
            
            el.parentNode.insertBefore(container, el);
            container.appendChild(el);
        });
    }
    
    static getFallbackText(imgSrc) {
        const map = {
            'Logo-Market.jpg': 'Logo Fiqq Market',
            'Logo-Qris.jpg': 'Logo QRIS',
            'Qris.jpg': 'Kode QRIS',
            'Logo-Bank.jpg': 'Logo Bank',
            'Logo-Bca.jpg': 'Logo BCA',
            'Logo-Ewallet.jpg': 'Logo E-Wallet',
            'Logo-Gopay.jpg': 'Logo Gopay',
            'Logo-Ovo.jpg': 'Logo OVO',
            'Logo-Dana.jpg': 'Logo Dana'
        };
        
        return map[imgSrc.split('/').pop()] || 'Gambar tidak tersedia';
    }
}

// Download QRIS function
function downloadQRIS() {
    const notificationManager = new NotificationManager();
    
    // Create canvas for QR code
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    
    // Get current theme colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#121212' : '#362828';
    const textColor = isDark ? '#f5f5f5' : '#ffffff';
    const primaryColor = '#a4a4a4';
    const secondaryColor = '#757575';
    
    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 400, 450);
    
    // Draw header
    const headerGradient = ctx.createLinearGradient(0, 0, 400, 80);
    headerGradient.addColorStop(0, primaryColor);
    headerGradient.addColorStop(1, secondaryColor);
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, 400, 80);
    
    // Draw header text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Fiqq Market QRIS', 200, 40);
    
    ctx.font = '14px Arial';
    ctx.fillText('Pembayaran Nasional', 200, 65);
    
    // Draw QR placeholder
    ctx.fillStyle = isDark ? '#1e1e1e' : '#4a3636';
    ctx.fillRect(100, 100, 200, 200);
    
    // Draw QR border
    const qrGradient = ctx.createLinearGradient(100, 100, 300, 300);
    qrGradient.addColorStop(0, primaryColor);
    qrGradient.addColorStop(1, secondaryColor);
    ctx.strokeStyle = qrGradient;
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 100, 200, 200);
    
    // Draw QR content
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN QR CODE', 200, 180);
    
    ctx.font = '14px Arial';
    ctx.fillText('NMID: ID1025459740441', 200, 210);
    
    // Draw footer
    ctx.font = '12px Arial';
    ctx.fillStyle = textColor;
    ctx.fillText('www.aspi-qris.id', 200, 340);
    ctx.fillText('Dicetak oleh: 93600915', 200, 360);
    ctx.fillText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 200, 380);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `QRIS-Fiqq-Market-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    notificationManager.show('QRIS berhasil diunduh!');
}

// Initialize application
class PaymentApp {
    constructor() {
        this.themeManager = null;
        this.notificationManager = null;
        this.clipboardManager = null;
        this.qrModalManager = null;
    }
    
    init() {
        // Initialize managers
        this.themeManager = new ThemeManager();
        this.notificationManager = new NotificationManager();
        this.clipboardManager = new ClipboardManager();
        this.qrModalManager = new QRModalManager();
        
        // Format account numbers
        this.formatAccountNumbers();
        
        // Add interactivity
        this.addInteractivity();
        
        // Check images
        ImageLoader.checkImages();
        
        // Add animations
        this.addAnimations();
        
        // Log initialization
        console.log('🎉 Fiqq Market Payment System initialized');
        console.log('📱 Responsive design: Enabled');
        console.log('🎨 Color palette: #362828, #757575, #a4a4a4');
        console.log('🌓 Dark mode: ' + (document.documentElement.getAttribute('data-theme') === 'dark'));
    }
    
    formatAccountNumbers() {
        const bcaAccount = document.querySelector('#bcaAccount .account-number-text');
        const ewalletAccount = document.querySelector('#ewalletAccount .account-number-text');
        
        if (bcaAccount) {
            bcaAccount.textContent = AccountFormatter.format(bcaAccount.textContent);
        }
        
        if (ewalletAccount) {
            ewalletAccount.textContent = AccountFormatter.format(ewalletAccount.textContent);
        }
    }
    
    addInteractivity() {
        // Add hover effects to payment methods
        const paymentMethods = document.querySelectorAll('.payment-method');
        
        paymentMethods.forEach(method => {
            method.addEventListener('mouseenter', () => {
                method.style.transform = 'translateY(-8px)';
            });
            
            method.addEventListener('mouseleave', () => {
                method.style.transform = 'translateY(0)';
            });
        });
        
        // Add click effects to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape closes modal
            if (e.key === 'Escape') {
                this.qrModalManager.hide();
            }
            
            // Ctrl+T toggles theme
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.themeManager.toggleTheme();
            }
            
            // Ctrl+C copies focused account number
            if (e.ctrlKey && e.key === 'c') {
                const focused = document.activeElement;
                if (focused.classList.contains('account-number-text')) {
                    const text = focused.textContent.replace(/\s/g, '');
                    this.clipboardManager.copy(text, 'Nomor berhasil disalin!');
                }
            }
        });
    }
    
    addAnimations() {
        // Add bounce animation to step icons
        const stepIcons = document.querySelectorAll('.step-icon');
        stepIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .step-icon {
                animation: bounce 2s ease infinite;
            }
            
            .payment-method {
                animation: fadeIn 0.6s ease-out;
            }
            
            .payment-method:nth-child(2) {
                animation-delay: 0.1s;
            }
            
            .payment-method:nth-child(3) {
                animation-delay: 0.2s;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Public methods for global access
    copyToClipboard(text, message) {
        this.clipboardManager.copy(text, message);
    }
    
    showQRScanner() {
        this.qrModalManager.show();
    }
    
    closeQRScanner() {
        this.qrModalManager.hide();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PaymentApp();
    app.init();
    
    // Make app available globally for inline onclick handlers
    window.paymentApp = app;
    
    // Global functions for inline onclick
    window.copyToClipboard = (text, message) => app.copyToClipboard(text, message);
    window.showQRScanner = () => app.showQRScanner();
    window.closeQRScanner = () => app.closeQRScanner();
    window.downloadQRIS = downloadQRIS;
    
    // Log performance info
    if ('connection' in navigator) {
        const connection = navigator.connection;
        console.log(`📡 Connection type: ${connection.effectiveType}`);
        console.log(`📊 Save data: ${connection.saveData ? 'Enabled' : 'Disabled'}`);
    }
});