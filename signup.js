firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.location.href='dashboard.html';
    }
});

let signup = ()=>{
    const email = document.getElementById('email');
    const password = document.getElementById('password');

        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((result)=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Account created successfuly!',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(result);
                document.location.href = 'login.html';
            })
            .catch(function(error) {
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