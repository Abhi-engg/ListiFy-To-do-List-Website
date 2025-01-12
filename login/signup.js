document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate form
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Create user object
    const user = {
        name: name,
        email: email,
        password: password
    };

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to user.html
    window.location.href = 'user.html';
});

// Add input validation
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

function validateName() {
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required');
    } else {
        removeError(nameInput);
    }
}

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

function validateConfirmPassword() {
    if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, 'Passwords do not match');
    } else {
        removeError(confirmPasswordInput);
    }
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error') || document.createElement('div');
    error.className = 'error';
    error.textContent = message;
    if (!formGroup.querySelector('.error')) {
        formGroup.appendChild(error);
    }
}

function removeError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error');
    if (error) {
        formGroup.removeChild(error);
    }
}