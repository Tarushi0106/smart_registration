class FormValidator {
    constructor() {
        this.disposableDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com', 'fake.com', 'test.com'];
        this.isSubmitting = false;
        this.form = null;
        this.submitBtn = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const attach = () => {
            this.form = document.getElementById('registrationForm');
            this.submitBtn = document.getElementById('submitBtn');

            if (!this.form) return;

            // Attach input listeners for real-time validation
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.validateField(input);
                    // If password field changes, also validate confirm password
                    if (input.name === 'password') {
                        const confirmPwd = this.form.querySelector('#confirmPassword');
                        if (confirmPwd && confirmPwd.value) {
                            this.validateField(confirmPwd);
                        }
                    }
                    this.checkFormValidity();
                });
                input.addEventListener('blur', () => {
                    this.validateField(input);
                    this.checkFormValidity();
                });
            });

            // Attach submit handler
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Initial validity check
            this.checkFormValidity();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attach);
        } else {
            // DOM already loaded — attach immediately
            attach();
        }
    }

    // Validate the whole form, return true if valid
    validateForm() {
        if (!this.form) return false;

        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            const fieldValid = this.validateField(input);
            if (!fieldValid) isValid = false;
        });

        // Additionally validate password confirmation
        const pwd = this.form.querySelector('#password');
        const cpwd = this.form.querySelector('#confirmPassword');
        if (pwd && cpwd && cpwd.value) {
            // Debug: log actual values
            console.log('Password field value:', JSON.stringify(pwd.value), 'length:', pwd.value.length);
            console.log('Confirm field value:', JSON.stringify(cpwd.value), 'length:', cpwd.value.length);
            console.log('Are they equal?', pwd.value === cpwd.value);
            
            if (pwd.value !== cpwd.value) {
                this.showError(cpwd, 'Passwords do not match.');
                isValid = false;
            } else {
                this.showSuccess(cpwd);
            }
        }

        return isValid;
    }

    // Validate a single field element. Returns true if valid.
    validateField(field) {
        if (!field) return true;

        const name = field.name || field.id;
        // For password fields, don't trim. For others, trim whitespace.
        const value = (name === 'password' || name === 'confirmPassword') 
            ? (field.value || '') 
            : (field.value || '').trim();

        // If field is not required and empty, clear error and pass
        if (!field.hasAttribute('required') && value === '') {
            this.clearError(field);
            return true;
        }

        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    this.showError(field, `${field.previousElementSibling?.textContent?.trim() || 'This field'} is required.`);
                    return false;
                }
                this.showSuccess(field);
                return true;

            case 'email':
                if (!value) {
                    this.showError(field, 'Email is required.');
                    return false;
                }
                // Basic email format
                const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                if (!emailRe.test(value)) {
                    this.showError(field, 'Please enter a valid email address.');
                    return false;
                }
                const domain = value.split('@')[1]?.toLowerCase();
                if (domain && this.disposableDomains.includes(domain)) {
                    this.showError(field, 'Disposable email addresses are not allowed.');
                    return false;
                }
                this.showSuccess(field);
                return true;

            case 'phone':
                if (!value) {
                    this.showError(field, 'Phone number is required.');
                    return false;
                }
                // Simple phone validation (digits, spaces, +, -)
                const phoneRe = /^[0-9+\-()\s]{6,20}$/;
                if (!phoneRe.test(value)) {
                    this.showError(field, 'Please enter a valid phone number.');
                    return false;
                }
                this.showSuccess(field);
                return true;

            case 'password':
                if (!value) {
                    this.showError(field, 'Password is required.');
                    return false;
                }
                // Check minimum length (no trimming on password itself)
                if (value.length < 8) {
                    this.showError(field, 'Password must be at least 8 characters long.');
                    return false;
                }
                this.showSuccess(field);
                return true;

            case 'confirmPassword':
                // Don't validate confirm password in validateField — only on submit
                // This prevents "mismatch" errors while user is still typing
                if (!value) {
                    this.showError(field, 'Please confirm your password.');
                    return false;
                }
                // For now, just mark it as success if it has content
                // Real validation happens in validateForm() at submit time
                this.showSuccess(field);
                return true;

            case 'terms':
                if (!field.checked) {
                    this.showError(field.closest('.checkbox-group') || field, 'You must accept the Terms & Conditions.');
                    return false;
                }
                this.showSuccess(field);
                return true;

            default:
                // For other required fields, just check non-empty
                if (field.hasAttribute('required') && !value) {
                    this.showError(field, 'This field is required.');
                    return false;
                }
                this.showSuccess(field);
                return true;
        }
    }

    resetForm() {
        if (!this.form) return;
        this.form.reset();
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.clearError(input));
        const successAlert = document.getElementById('successAlert');
        if (successAlert) successAlert.style.display = 'none';
        const errorAlert = document.getElementById('errorAlert');
        if (errorAlert) errorAlert.style.display = 'none';
        this.checkFormValidity();
    }

    checkFormValidity() {
        if (!this.form || !this.submitBtn) return;
        // Keep the submit button available at all times per UX requirement.
        // Only disable it while an actual submission is in progress to prevent double submits.
        this.submitBtn.disabled = !!this.isSubmitting;
    }

    showAlert(message, type, details = '') {
        const successAlert = document.getElementById('successAlert');
        const errorAlert = document.getElementById('errorAlert');
        const errorAlertMessage = document.getElementById('errorAlertMessage');

        // Hide both alerts first
        if (successAlert) successAlert.style.display = 'none';
        if (errorAlert) errorAlert.style.display = 'none';

        if (type === 'success' && successAlert) {
            // If details provided, update the paragraph text; keep the strong heading
            try {
                const strong = successAlert.querySelector('strong');
                const p = successAlert.querySelector('p');
                if (strong && !strong.textContent.trim()) strong.textContent = 'Registration Successful!';
                if (p) p.textContent = details || p.textContent || 'Your profile has been submitted successfully. Welcome to our community!';
            } catch (e) {
                // ignore DOM structure problems
            }

            successAlert.style.display = 'flex';
            // Ensure the success alert is visible at the top of the viewport
            try {
                successAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (e) {}

            // Auto-hide success after 4 seconds
            setTimeout(() => {
                if (successAlert) successAlert.style.display = 'none';
            }, 4000);
        } else if (type === 'error' && errorAlert) {
            errorAlert.style.display = 'flex';
            if (details && errorAlertMessage) {
                errorAlertMessage.textContent = details;
            }
            try {
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (e) {}
        }
    }

    showSuccessMessage(details = '') {
        this.showAlert('', 'success', details);
    }

    showErrorMessage(details = 'Some required fields are missing or invalid.') {
        this.showAlert('', 'error', details);
    }

    // Existing handleSubmit method (keeps behavior but uses our helpers)
    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) {
            console.log('Already submitting, please wait...');
            return;
        }

        // Validate all fields before submission
        const isValid = this.validateForm();

        if (!isValid) {
            this.showErrorMessage('Please check the red highlighted fields below.');

            // Scroll to first error
            const firstError = document.querySelector('.error, .error-field');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        this.isSubmitting = true;
        if (this.submitBtn) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        }

        try {
            const formData = new FormData(this.form);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                age: formData.get('age') || null,
                gender: formData.get('gender'),
                address: formData.get('address') || '',
                country: formData.get('country') || '',
                state: formData.get('state') || '',
                city: formData.get('city') || '',
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                terms: formData.get('terms') ? 'true' : 'false'
            };

            console.log('Submitting form data:', data);

            // NOTE: The project does not include a server by default. Attempting to POST
            // to /api/register may fail in this static deployment. We'll still try so
            // integrations with a backend will work when present.
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).catch(err => null);

            if (response) {
                const result = await response.json();
                if (result.success) {
                    const msg = result.message || 'Your profile has been submitted successfully. Welcome to our community!';
                    this.showSuccessMessage(msg);
                    document.querySelector('.form-container')?.classList.add('success-celebration');
                    // Reset form after the success alert auto-hides (4 seconds)
                    setTimeout(() => {
                        document.querySelector('.form-container')?.classList.remove('success-celebration');
                        this.resetForm();
                    }, 4500);
                    console.log('✅ Registration successful:', data.email);
                } else {
                    this.showErrorMessage(result.message || 'Registration failed. Please check your information.');
                    if (result.errors) {
                        result.errors.forEach(error => {
                            const field = this.form.querySelector(`[name="${error.path}"]`);
                            if (field) this.showError(field, error.msg);
                        });
                    }
                }
            } else {
                // No backend present — just show success for demo purposes
                const simMsg = 'Your profile has been submitted successfully. Welcome to our community!';
                this.showSuccessMessage(simMsg);
                document.querySelector('.form-container')?.classList.add('success-celebration');
                setTimeout(() => {
                    document.querySelector('.form-container')?.classList.remove('success-celebration');
                    this.resetForm();
                }, 4500);
                console.log('✅ Registration simulated (no backend).');
            }

        } catch (error) {
            console.error('❌ Submission error:', error);
            this.showErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            this.isSubmitting = false;
            if (this.submitBtn) {
                this.submitBtn.classList.remove('loading');
                this.checkFormValidity();
            }
        }
    }

    // Enhanced showError method to add red line effect
    showError(field, message) {
        if (!field) return;
        // If the field is a wrapper (like checkbox-group), make best-effort to find the input
        const input = (field.tagName && (field.tagName.toLowerCase() === 'input' || field.tagName.toLowerCase() === 'select' || field.tagName.toLowerCase() === 'textarea')) ? field : field.querySelector('input, select, textarea') || field;
        input.classList.add('error');
        input.classList.remove('success');

        const formGroup = input.closest('.form-group') || input.closest('.checkbox-group') || input.parentElement;
        if (formGroup) {
            formGroup.classList.add('error-field');
        }

        const errorElement = document.getElementById((input.id || input.name) + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    showSuccess(field) {
        if (!field) return;
        const input = (field.tagName && (field.tagName.toLowerCase() === 'input' || field.tagName.toLowerCase() === 'select' || field.tagName.toLowerCase() === 'textarea')) ? field : field.querySelector('input, select, textarea') || field;
        input.classList.remove('error');
        input.classList.add('success');

        const formGroup = input.closest('.form-group') || input.closest('.checkbox-group') || input.parentElement;
        if (formGroup) {
            formGroup.classList.remove('error-field');
        }

        const errorElement = document.getElementById((input.id || input.name) + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    clearError(field) {
        if (!field) return;
        const input = (field.tagName && (field.tagName.toLowerCase() === 'input' || field.tagName.toLowerCase() === 'select' || field.tagName.toLowerCase() === 'textarea')) ? field : field.querySelector('input, select, textarea') || field;
        input.classList.remove('error');
        input.classList.remove('success');

        const formGroup = input.closest('.form-group') || input.closest('.checkbox-group') || input.parentElement;
        if (formGroup) {
            formGroup.classList.remove('error-field');
        }

        const errorElement = document.getElementById((input.id || input.name) + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
}

// Initialize form validation instance and expose for debugging
const initFormValidator = () => {
    window.formValidator = new FormValidator();
    console.log('✅ FormValidator initialized');
};

// If DOMContentLoaded already fired, initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormValidator);
} else {
    initFormValidator();
}