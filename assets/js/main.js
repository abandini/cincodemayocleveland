/**
 * Cinco de Mayo Cleveland - Main JavaScript
 * Handles countdown timer, interactive elements, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initCountdown();
    
    // Initialize navbar scroll behavior
    initNavbarScroll();
    
    // Initialize form validation
    initFormValidation();
});

/**
 * Countdown Timer to Cinco de Mayo
 */
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    if (!countdownElement) {
        console.log('Countdown element not found');
        return;
    }
    
    console.log('Initializing countdown timer...');
    
    // Set the date for next Cinco de Mayo (May 5, 2025)
    const cincoDate = new Date(2025, 4, 5, 0, 0, 0).getTime(); // Note: Month is 0-indexed, so 4 = May
    console.log('Target date (Cinco de Mayo 2025):', new Date(cincoDate).toString());
    
    // Get current date for debugging
    const now = new Date().getTime();
    console.log('Current date:', new Date(now).toString());
    console.log('Time difference (ms):', cincoDate - now);
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and Cinco de Mayo
        const distance = cincoDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement && hoursElement && minutesElement && secondsElement) {
            daysElement.innerHTML = days.toString().padStart(2, '0');
            hoursElement.innerHTML = hours.toString().padStart(2, '0');
            minutesElement.innerHTML = minutes.toString().padStart(2, '0');
            secondsElement.innerHTML = seconds.toString().padStart(2, '0');
            
            // Log values occasionally for debugging
            if (seconds % 10 === 0) {
                console.log(`Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        } else {
            console.error('One or more countdown elements not found');
            clearInterval(countdownTimer);
        }
        
        // If the countdown is finished, display message
        if (distance < 0) {
            console.log('Countdown finished!');
            clearInterval(countdownTimer);
            countdownElement.innerHTML = "<h3>¡Feliz Cinco de Mayo!</h3>";
        }
    }, 1000);
}

/**
 * Navbar scroll behavior
 * Changes navbar background on scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(0, 99, 65, 1)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(0, 99, 65, 0.9)';
        }
    });
}

/**
 * Form Validation
 * Validates the newsletter and contact forms
 */
function initFormValidation() {
    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const privacyCheck = document.getElementById('privacyCheck');
            
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            if (!privacyCheck.checked) {
                showError(privacyCheck, 'You must agree to the privacy policy');
                return;
            }
            
            // If validation passes, submit the form (would be AJAX in production)
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
    
    // Contact form validation (for contact.html page)
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Form validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'message'];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                } else {
                    clearError(input);
                }
            });
            
            // Email validation
            const emailInput = document.getElementById('email');
            if (emailInput && !validateEmail(emailInput.value)) {
                isValid = false;
                showError(emailInput, 'Please enter a valid email address');
            }
            
            if (!isValid) {
                event.preventDefault();
                document.getElementById('formError').textContent = 'Please fill in all required fields correctly.';
            } else {
                // The form will submit to Getform.io
                // Redirect will happen after successful submission
                localStorage.setItem('formSubmitted', 'true');
            }
        });
    }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @return {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message for form input
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showError(input, message) {
    input.classList.add('is-invalid');
    
    // Find or create error message element
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
}

/**
 * Clear error message for form input
 * @param {HTMLElement} input - The input element
 */
function clearError(input) {
    input.classList.remove('is-invalid');
    
    // Remove error message if it exists
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
        errorElement.textContent = '';
    }
}

/**
 * Lazy loading for images
 * This will be initialized when browser support is detected
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }
}

/**
 * Thank You Page Redirect
 * Redirects users who didn't submit the form
 */
function initThankYouPage() {
    // Only run on the thank-you.html page
    if (window.location.pathname.includes('thank-you.html')) {
        if (!localStorage.getItem('formSubmitted')) {
            // Redirect users who didn't submit the form
            window.location.href = '/contact.html';
        } else {
            // Clear the flag for future submissions
            localStorage.removeItem('formSubmitted');
        }
    }
}

// Initialize lazy loading after page load
window.addEventListener('load', function() {
    initLazyLoading();
    initThankYouPage();
});
