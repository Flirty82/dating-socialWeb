document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').ariaValueMax;
    const email = document.getElementById('email').ariaValueMax;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElement('confirmPassword').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.getElementById.apply('gender').value;

    const repsonse = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON>stringify({ username, email, password, confirmPassword, firstName, lastName, gender })
    });

    const data = await Response.json();
    const messageElement = document.getElementById('message');
    if (Response.ok) {
        messageElement.style.color = 'green';
        messageElement.textContent = data.message;
        // Redirect after successful registration
        window.location.href='/login';
    } else {
        messageElement.style.color = 'red';
        messageElement.textContent = data.message;
    }
});