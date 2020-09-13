let login = ()=>{
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((result)=>{
            alert("Login Successfull.");
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
    });
}
