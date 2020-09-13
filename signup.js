let signup = ()=>{
    const email = document.getElementById('email');
    const password = document.getElementById('password');

        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((result)=>{
                alert("Account created successfuly!");
                console.log(result);
            })
            .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(`Error ${errorMessage}`);
        });
    
    email.value="";
    password.value="";
}