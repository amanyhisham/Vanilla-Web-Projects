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
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

             if (!email || !password) {
                return showError('Please fill in all fields.');
            }

             if (!emailRegex.test(email)) {
                return showError('Please enter a valid email address.');
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user  = users.find(u => u.email === email && u.password === password);

            if (!user) {
                return showError('Invalid email or password. Please try again.');
            }

             Swal.fire({
                icon: 'success',
                title: `Welcome back, ${user.name}!`,
                text: 'Redirecting you...',
                confirmButtonColor: '#d4847a',
                confirmButtonText: 'Continue',
                timer: 2500,
                timerProgressBar: true,
                willClose: () => { 
                      localStorage.setItem("currentUser", JSON.stringify(user));
                    window.location.replace('../index.html');}
            }) 
        });