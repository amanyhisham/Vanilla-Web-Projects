 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex  = /^[a-zA-Z\u0600-\u06FF\s]+$/; 

        function showError(msg) {
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: msg,
                confirmButtonColor: '#d4847a',
                confirmButtonText: 'Try again'
            });
        }

        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms          = document.getElementById('terms').checked;

             if (!firstName || !lastName || !email || !password || !confirmPassword) {
                return showError('Please fill in all fields.');
            }

             if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
                return showError('Name must contain letters only, no numbers.');
            }

             if (!emailRegex.test(email)) {
                return showError('Please enter a valid email address.');
            }

             if (password.length < 8) {
                return showError('Password must be at least 8 characters.');
            }

             if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
                return showError('Password must contain at least one uppercase letter and one number.');
            }

             if (password !== confirmPassword) {
                return showError('Passwords do not match.');
            }

             if (!terms) {
                return showError('You must accept the Terms and Privacy Policy.');
            }

             let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.email === email)) {
                return showError('This email is already registered. Try logging in.');
            }

             users.push({ name: firstName + ' ' + lastName, email, password });
            localStorage.setItem('users', JSON.stringify(users));

            Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: 'Welcome to Brand. Redirecting you to login...',
                confirmButtonColor: '#d4847a',
                confirmButtonText: 'Go to Login',
                timer: 2500,
                timerProgressBar: true,
                willClose: () => { window.location.href = 'login.html'; }
            });
        });