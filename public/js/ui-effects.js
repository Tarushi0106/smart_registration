class UIEffects {
    constructor() {
        this.initializeEventListeners();
        this.initializeAnimations();
    }

    initializeEventListeners() {
        // Password visibility toggle
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility('password', 'togglePassword');
        });

        document.getElementById('toggleConfirmPassword').addEventListener('click', () => {
            this.togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
        });

        // Input focus effects
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        // Form submission loading state
        const form = document.getElementById('registrationForm');
        form.addEventListener('submit', () => {
            this.animateButton();
        });
    }

    initializeAnimations() {
        // Add floating animation to form elements on load
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.animationDelay = `${index * 0.1}s`;
            group.classList.add('fade-in-up');
        });
    }

    togglePasswordVisibility(fieldId, toggleId) {
        const field = document.getElementById(fieldId);
        const toggle = document.getElementById(toggleId);
        const icon = toggle.querySelector('i');

        if (field.type === 'password') {
            field.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            field.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    animateButton() {
        const button = document.getElementById('submitBtn');
        button.classList.add('pulse');
        
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 600);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .form-group.focused label {
        color: #667eea;
        transform: translateY(-2px);
    }

    .submit-btn.pulse {
        animation: pulse 0.6s ease-in-out;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .strength-meter::before {
        width: var(--strength, 0%);
    }
`;

document.head.appendChild(style);

// Initialize UI effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UIEffects();
});