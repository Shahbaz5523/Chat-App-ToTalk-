let useremail = document.getElementById('useremail');
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // ...
    } else {
      // User is signed out.
      // ...
      document.location.href='login.html';
    }
  });


  let logout = ()=>{
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
        firebase.auth().signOut().then(function() {
          Swal.fire(
            'Logout!',
            'User logout sucessfully.',
            'success'
          )
          document.location.href='login.html';
        }).catch(function(error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          })
        });
      }
    })
  }

  let showMenu = ()=>{
    const ul = document.getElementById('dropDown');
    ul.classList.toggle('show');
  }