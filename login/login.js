document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Here you would typically send the login data to your server
    console.log('Login attempt', {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    });
    // Redirect to user.html
    window.location.href = '/dashboard/user.html';
});

// Add input validation and error handling
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
    } else {
        removeError(emailInput);
    }
}

function validatePassword() {
    if (passwordInput.value.length < 6) {
        showError(passwordInput, 'Password must be at least 6 characters long');
    } else {
        removeError(passwordInput);
    }
}

function showError(input, message) {
    const formGroup = input.parentElement;
    let error = formGroup.querySelector('.error');
    if (!error) {
        error = document.createElement('div');
        error.className = 'error';
        formGroup.appendChild(error);
    }
    error.textContent = message;
    input.style.borderColor = 'var(--error-color)';
}

function removeError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error');
    if (error) {
        formGroup.removeChild(error);
    }
    input.style.borderColor = '#444';
}