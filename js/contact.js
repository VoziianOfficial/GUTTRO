'use strict';

(function () {
    const guttro = window.GUTTRO || {};
    const form = document.querySelector('[data-contact-form]');

    if (!form) return;

    const successMessage = form.querySelector('[data-form-success]');
    const errorMessage = form.querySelector('[data-form-error]');
    const submitButton = form.querySelector('button[type="submit"]');

    const fields = {
        fullName: form.querySelector('#full-name'),
        email: form.querySelector('#email'),
        phone: form.querySelector('#phone'),
        zipCode: form.querySelector('#zip-code'),
        serviceInterest: form.querySelector('#service-interest'),
        message: form.querySelector('#message'),
        consent: form.querySelector('#consent')
    };

    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
        zipCode: /^\d{5}(-\d{4})?$/,
        phone: /^[+]?[(]?[0-9\s().-]{7,20}$/
    };

    const setFieldState = (field, isValid) => {
        if (!field) return;

        field.classList.toggle('is-invalid', !isValid);
        field.classList.toggle('is-valid', isValid);
        field.setAttribute('aria-invalid', String(!isValid));
    };

    const setCheckboxState = (checkbox, isValid) => {
        if (!checkbox) return;

        const wrapper = checkbox.closest('.form-checkbox');

        wrapper?.classList.toggle('is-invalid', !isValid);
        checkbox.setAttribute('aria-invalid', String(!isValid));
    };

    const clearMessages = () => {
        successMessage?.classList.remove('is-visible');
        errorMessage?.classList.remove('is-visible');
    };

    const showSuccess = () => {
        errorMessage?.classList.remove('is-visible');
        successMessage?.classList.add('is-visible');
    };

    const showError = () => {
        successMessage?.classList.remove('is-visible');
        errorMessage?.classList.add('is-visible');
    };

    const validateRequiredText = (field) => {
        const isValid = Boolean(field && field.value.trim().length >= 2);
        setFieldState(field, isValid);
        return isValid;
    };

    const validateEmail = (field) => {
        const value = field?.value.trim() || '';
        const isValid = patterns.email.test(value);
        setFieldState(field, isValid);
        return isValid;
    };

    const validatePhone = (field) => {
        const value = field?.value.trim() || '';

        if (!value) {
            field?.classList.remove('is-invalid', 'is-valid');
            field?.removeAttribute('aria-invalid');
            return true;
        }

        const isValid = patterns.phone.test(value);
        setFieldState(field, isValid);
        return isValid;
    };

    const validateZip = (field) => {
        const value = field?.value.trim() || '';
        const isValid = patterns.zipCode.test(value);
        setFieldState(field, isValid);
        return isValid;
    };

    const validateSelect = (field) => {
        const isValid = Boolean(field && field.value);
        setFieldState(field, isValid);
        return isValid;
    };

    const validateConsent = (checkbox) => {
        const isValid = Boolean(checkbox && checkbox.checked);
        setCheckboxState(checkbox, isValid);
        return isValid;
    };

    const validateForm = () => {
        const results = [
            validateRequiredText(fields.fullName),
            validateEmail(fields.email),
            validatePhone(fields.phone),
            validateZip(fields.zipCode),
            validateSelect(fields.serviceInterest),
            validateConsent(fields.consent)
        ];

        return results.every(Boolean);
    };

    const focusFirstInvalid = () => {
        const firstInvalid = form.querySelector(
            '.is-invalid input, .is-invalid, [aria-invalid="true"]'
        );

        if (firstInvalid && typeof firstInvalid.focus === 'function') {
            firstInvalid.focus();
        }
    };

    const resetValidationClasses = () => {
        form.querySelectorAll('.is-invalid, .is-valid').forEach((element) => {
            element.classList.remove('is-invalid', 'is-valid');
        });

        form.querySelectorAll('[aria-invalid]').forEach((element) => {
            element.removeAttribute('aria-invalid');
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        clearMessages();

        const isValid = validateForm();

        if (!isValid) {
            showError();
            focusFirstInvalid();
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('is-loading');
        }

        window.setTimeout(() => {
            showSuccess();

            form.reset();
            resetValidationClasses();

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('is-loading');
            }
        }, 450);
    };

    const initLiveValidation = () => {
        fields.fullName?.addEventListener('input', () => {
            if (form.dataset.submitted === 'true') {
                validateRequiredText(fields.fullName);
            }
        });

        fields.email?.addEventListener('input', () => {
            if (form.dataset.submitted === 'true') {
                validateEmail(fields.email);
            }
        });

        fields.phone?.addEventListener('input', () => {
            if (form.dataset.submitted === 'true') {
                validatePhone(fields.phone);
            }
        });

        fields.zipCode?.addEventListener('input', () => {
            fields.zipCode.value = fields.zipCode.value.replace(/[^\d-]/g, '');

            if (form.dataset.submitted === 'true') {
                validateZip(fields.zipCode);
            }
        });

        fields.serviceInterest?.addEventListener('change', () => {
            if (form.dataset.submitted === 'true') {
                validateSelect(fields.serviceInterest);
            }
        });

        fields.consent?.addEventListener('change', () => {
            if (form.dataset.submitted === 'true') {
                validateConsent(fields.consent);
            }
        });
    };

    const init = () => {
        form.addEventListener('submit', (event) => {
            form.dataset.submitted = 'true';
            handleSubmit(event);
        });

        initLiveValidation();

        if (typeof guttro.refreshIcons === 'function') {
            guttro.refreshIcons();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();