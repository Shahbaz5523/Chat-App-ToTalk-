let useremail = document.getElementById('useremail');
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var photoURL = user.photoURL;
    var uid = user.uid;
    // Store Users in Database
    let userData = { name: displayName, photoURL: photoURL, uid: uid, email: user.email, number: user.phoneNumber };
    if (displayName) {
      userData.name = displayName;
    }else{
      firebase.database().ref('users/namesofemailusers/' + uid).on('value', (data) => {
        let d = data.val();
        let key = Object.getOwnPropertyNames(d)[0];
        profilePic.title = d[key].name;
      })
    }
    let db = firebase.database();
    db.ref(`users/userslist/${uid}`).set(userData);

    let profilePic = document.getElementById('profile-pic');
    // Display photo if available
    if (photoURL) {
      profilePic.src = photoURL;
      console.log(photoURL)
    } else {
      profilePic.src = 'img/icon/user.ico';
      profilePic.classList.add('default-img');
    }
    // Display username if available
    if (displayName) {
      profilePic.title = displayName;
    }
  } else {
    document.location.href = 'login.html';
  }
});


let logout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to logout!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Did it!'
  }).then((result) => {
    if (result.isConfirmed) {
      firebase.auth().signOut().then(function () {
        Swal.fire(
          'Logout!',
          'User logout sucessfully.',
          'success'
        )
        document.location.href = 'login.html';
      }).catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        })
      });
    }
  })
}

let showMenu = () => {
  const ul = document.getElementById('dropDown');
  ul.classList.toggle('show');
}