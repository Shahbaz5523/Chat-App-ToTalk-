firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.location.href = 'dashboard.html';
    }
});

let login = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((result) => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Login Successfull.',
                showConfirmButton: false,
                timer: 1500
            })
            document.location.href = 'dashboard.html';
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })
        });
}
