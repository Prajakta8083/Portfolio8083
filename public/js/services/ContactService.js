/**
 * ContactService
 * Handles form submission and data privacy consent.
 */

export const ContactService = {
    init() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', this.handleSubmit.bind(this));
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Consent check (implicitly handled by 'required' attribute on checkbox in HTML)
        // But double check here logic wise if we were sending to API.

        console.log('[Contact] Form submitted:', data);

        // Mock Success
        const btn = e.target.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Message Sent!';
        btn.style.backgroundColor = 'var(--success)';
        btn.style.color = '#000';

        e.target.reset();

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 3000);
    }
};
