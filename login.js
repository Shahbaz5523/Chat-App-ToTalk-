const login = () => {
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
            var errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })
        });
}
const LoginWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        let user = result.user;
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${user.displayName} Login Successfull.`,
            showConfirmButton: false,
            timer: 1500
        })
    }).catch(function (error) {
        var errorMessage = error.message;
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage,
        })
    });
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.location.href = 'dashboard.html';
    }
});