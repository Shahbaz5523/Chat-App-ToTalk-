let promise;
let signup = () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (name.value.length >= 3) {
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((result) => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Account created successfuly!',
                    showConfirmButton: false,
                    timer: 1500
                })
                // localStorage.setItem('key',JSON.stringify(name.value));
                firebase.database().ref('users/namesofemailusers/' + result.user.uid).push({
                    name: name.value
                });
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorMessage = error.message;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorMessage,
                })
            });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'User name Not Valid!',
        })
    }
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        async function redirect(){
            promise = new Promise((resolve, reject) => {
                firebase.database().ref('users/namesofemailusers/' + user.uid).on('value', (data) => {
                    if (data.val()) {
                        resolve(data.val());
                    } else {
                        reject("Some error")
                    }
                })
            })
            
            var data = await promise;
            if(data){
                document.location.href = 'login.html';
            }
        }
        redirect();
    }
});