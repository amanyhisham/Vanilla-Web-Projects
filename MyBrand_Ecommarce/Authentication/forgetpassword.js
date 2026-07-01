   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function showError(msg) {
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: msg,
                confirmButtonColor: '#d4847a',
                confirmButtonText: 'Try again'
            });
        }

        document.getElementById('resetForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email           = document.getElementById('email').value.trim();
            const newPassword     = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

             if (!email || !newPassword || !confirmPassword) {
                return showError('Please fill in all fields.');
            }

             if (!emailRegex.test(email)) {
                return showError('Please enter a valid email address.');
            }

             if (newPassword.length < 8) {
                return showError('Password must be at least 8 characters.');
            }

             if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
                return showError('Password must contain at least one uppercase letter and one number.');
            }

             if (newPassword !== confirmPassword) {
                return showError('Passwords do not match.');
            }

             let users = JSON.parse(localStorage.getItem('users')) || [];//object
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex === -1) {
                return showError('No account found with this email address.');
            }

            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));

            Swal.fire({
                icon: 'success',
                title: 'Password Reset!',
                text: 'Your password has been updated. Redirecting to login...',
                confirmButtonColor: '#d4847a',
                confirmButtonText: 'Go to Login',
                timer: 2500,
                timerProgressBar: true,
                willClose: () => { window.location.replace('login.html'); }
            });
        });