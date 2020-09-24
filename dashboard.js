var massageKey = '';
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
    } else {
      firebase.database().ref('users/namesofemailusers/' + uid).on('value', (data) => {
        let d = data.val();
        let key = Object.getOwnPropertyNames(d)[0];
        profilePic.title = d[key].name;
      })
    }
    let db = firebase.database();
    db.ref(`users/userslist/${uid}`).set(userData);
    db.ref(`users/activeNow/${uid}`).set({ id: uid, status: 'active' });

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
  var logoutUserId = firebase.auth().currentUser.uid;
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
        firebase.database().ref('users/activeNow/' + logoutUserId).remove();
        // document.location.href = 'login.html';
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

//  Change Tabs
const changeTabs = tab_name => {
  let tab1 = document.getElementById('tab1');
  let tab2 = document.getElementById('tab2');
  let tab3 = document.getElementById('tab3');
  let tab1_body = document.getElementById('chatTab');
  let tab2_body = document.getElementById('userTab');
  let tab3_body = document.getElementById('profileTab');
  let newChatBtn = document.getElementById('newChatBtn');

  if (tab_name == 'tab1') {
    if (!tab1.classList.contains('active')) {
      tab1.classList.add('active');
      tab1_body.classList.add('changeTab');
      tab2.classList.remove('active');
      tab2_body.classList.remove('changeTab');
      tab3.classList.remove('active');
      tab3_body.classList.remove('changeTab');
      document.getElementById("searchBox").style.display = "flex";
      newChatBtn.style.display = 'flex';
    }
  } else if (tab_name == 'tab2') {
    if (!tab2.classList.contains('active')) {
      tab2.classList.add('active');
      tab2_body.classList.add('changeTab');
      tab1.classList.remove('active');
      tab1_body.classList.remove('changeTab');
      tab3.classList.remove('active');
      tab3_body.classList.remove('changeTab');
      document.getElementById("searchBox").style.display = "flex";
      newChatBtn.style.display = 'none';
    }
  }
  else {
    if (!tab3.classList.contains('active')) {
      tab3.classList.add('active');
      tab3_body.classList.add('changeTab');
      tab1.classList.remove('active');
      tab1_body.classList.remove('changeTab');
      tab2.classList.remove('active');
      tab2_body.classList.remove('changeTab');
      // disable search when profile tab is open
      document.getElementById("searchBox").style.display = "none";
      newChatBtn.style.display = 'none';
    }
  }
}
// Show Chat histroy
firebase.database().ref('/users/').on('value', (data) => {
  if (document.getElementById("chatTab").children.length != 0) {
    document.getElementById("chatTab").innerHTML = "";
  }
  let freindsIds = [];
  if (data) {
    let wholeData = data.val()
    let friendListData = wholeData['friendList'];
    for (const key in friendListData) {
      if (friendListData.hasOwnProperty(key)) {
        const element = friendListData[key];
        if (firebase.auth().currentUser.uid === element.UserUid) {
          freindsIds.push(element.friendUid);
        } else if (firebase.auth().currentUser.uid === element.friendUid) {
          freindsIds.push(element.UserUid);
        }
      }
    }
    freindsIds.forEach(id => {
      let div = document.createElement('div');
      div.setAttribute("check", id);
      div.setAttribute('class', 'userBox');
      div.setAttribute('onclick', `startChat('${id}')`);
      // div for pic 
      let div2 = document.createElement('div');
      // span tag that hold pic element
      let span = document.createElement('span');
      // img tag
      let img = document.createElement('img');
      img.setAttribute("id", 'user-img');

      let usersData = wholeData['userslist'];
      for (const key in usersData) {
        if (usersData.hasOwnProperty(key)) {
          if (key === id) {
            const element = usersData[key];
            if (element.photoURL) {
              const url = element.photoURL;
              img.src = url;
            } else {
              img.src = 'img/icon/user.ico';
              img.classList.add('default-img')
              img.classList.add('invert-color')
            }
          }
        }
      }
      span.appendChild(img);
      div2.appendChild(span);
      div.appendChild(div2);

      let div3 = document.createElement('div');
      let p1 = document.createElement('p');
      let p2 = document.createElement('p');
      p1.setAttribute('class', 'user-name');
      p2.setAttribute('class', 'last-sms');
      let p1Text;
      for (const key in usersData) {
        if (usersData.hasOwnProperty(key)) {
          if (key === id) {
            const element = usersData[key];
            const name = element.name;
            p1Text = document.createTextNode(name);
          } else {
            let emailName = wholeData['namesofemailusers'];
            for (const key in emailName) {
              if (key === id) {
                if (emailName.hasOwnProperty(key)) {
                  const element = emailName[key];
                  for (const key2 in element) {
                    if (element.hasOwnProperty(key2)) {
                      const unames = element[key2];
                      p1Text = document.createTextNode(unames.name);
                    }
                  }
                }
              }
            }
          }
        }
      }
      p1.appendChild(p1Text);
      div3.appendChild(p1);
      let p2Text = document.createTextNode('Last Sms here...');
      p2.appendChild(p2Text);
      div3.appendChild(p2);
      div.appendChild(div3);
      document.getElementById('chatTab').appendChild(div);
    });
  }
})



// logout user when it close the tab
// Display users in the users in the tab
firebase.database().ref('users/').on('value', (data) => {
  let usersList = data.val().userslist;
  let currentUser = firebase.auth().currentUser.uid;
  let namesofemailusers = data.val().namesofemailusers;
  let userTab = document.getElementById('userTab');
  // remove current login user data from userslist
  delete usersList[currentUser]
  delete namesofemailusers[currentUser];
  // get uids from userlist
  let uids = Object.getOwnPropertyNames(usersList);
  // run a loop in uids to render data on web page
  uids.forEach(uid => {
    let nameskey;
    if (namesofemailusers[uid]) {
      nameskey = Object.getOwnPropertyNames(namesofemailusers[uid]);
    } else {
      nameskey = '';
    }
    // console.log(namesofemailusers)
    // main div
    let div = document.createElement('div');
    div.setAttribute('class', 'userBox');
    div.setAttribute('onclick', `startChat('${uid}')`);
    // div for pic 
    let div2 = document.createElement('div');
    // span tag that hold pic element
    let span = document.createElement('span');
    // img tag
    let img = document.createElement('img');
    if (usersList[uid].photoURL) {
      img.src = usersList[uid].photoURL;
    } else {
      img.src = 'img/icon/user.ico';
      img.classList.add('default-img')
      img.classList.add('invert-color')
    }
    img.setAttribute('id', 'user-img');
    span.appendChild(img);
    div2.appendChild(span);
    div.appendChild(div2);

    let div3 = document.createElement('div');
    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    p1.setAttribute('class', 'user-name');
    p2.setAttribute('class', 'last-sms');
    let p1Text;
    if (usersList[uid].name) {
      p1Text = document.createTextNode(usersList[uid].name);
    } else {
      if (namesofemailusers[uid]) {
        p1Text = document.createTextNode(namesofemailusers[uid][nameskey].name);
      }
    }
    p1.appendChild(p1Text);
    div3.appendChild(p1);
    let p2Text = document.createTextNode('Click to start Chat');
    p2.appendChild(p2Text);
    div3.appendChild(p2);
    div.appendChild(div3);
    if (userTab.childNodes.length >= 1 && userTab.childNodes.length <= uids.length) {
      userTab.appendChild(div);
    }
  });
})

// new chat button 
const newchat = () => {
  let tab1 = document.getElementById('tab1');
  let tab2 = document.getElementById('tab2');
  let tab3 = document.getElementById('tab3');
  let tab1_body = document.getElementById('chatTab');
  let tab2_body = document.getElementById('userTab');
  let tab3_body = document.getElementById('profileTab');
  let newChatBtn = document.getElementById('newChatBtn');

  if (!tab2.classList.contains('active')) {
    tab2.classList.add('active');
    tab2_body.classList.add('changeTab');
    tab1.classList.remove('active');
    tab1_body.classList.remove('changeTab');
    tab3.classList.remove('active');
    tab3_body.classList.remove('changeTab');
    document.getElementById("searchBox").style.display = "flex";
    newChatBtn.style.display = 'none';
  }
}

// show Talk Box when user click on any user
let startChat = uid => {
  const targetUserId = uid;
  // show and hide main page and chat page
  let main = document.getElementById('main');
  let talkBox = document.getElementById('talkBox');
  main.style.display = "none";
  talkBox.style.display = "block";

  // In Chat page show current user data like img and pic;
  firebase.database().ref('users/').on('value', (data) => {
    let usersList = data.val().userslist;
    let namesofemailusers = data.val().namesofemailusers;
    let currentUser = usersList[targetUserId]
    let currentEmailUserName = namesofemailusers[targetUserId];
    let user_name = document.getElementById('user-name');
    let user_img = document.getElementsByClassName('chatUserimg');
    // set user name
    if (currentUser.name) {
      user_name.innerText = currentUser.name;
    } else {
      let key = Object.getOwnPropertyNames(namesofemailusers[targetUserId])[0];
      user_name.innerText = currentEmailUserName[key].name;
    }

    // set user img
    if (currentUser.photoURL) {
      user_img[0].setAttribute('src', `${currentUser.photoURL}`);
    } else {
      user_img[0].setAttribute('src', `img/icon/user.ico`);
      user_img[0].style.backgroundColor = "black";
      user_img[0].classList.add('small-img');
    }

  });

  // Create a friendShip List into the database
  let friends = {
    UserUid: firebase.auth().currentUser.uid,
    friendUid: targetUserId
  }

  let friend = false;
  firebase.database().ref('/users/friendList/').on('value', (result) => {
    let firebaseFriendList = result.val();
    if (firebaseFriendList) {
      for (const key in firebaseFriendList) {
        if (key == friends.UserUid + "_" + friends.friendUid) {
          friend = true;
          console.log('Already friend');
          massageKey = friends.UserUid + "_" + friends.friendUid;
        } else if (key == friends.friendUid + "_" + friends.UserUid) {
          friend = true;
          console.log('Already friend');
          massageKey = friends.friendUid + "_" + friends.UserUid;
        }
      }
    } else {
      firebase.database().ref('/users/friendList/' + friends.UserUid + "_" + friends.friendUid).set(friends);
      // friend = false;
    }
    if (friend != true) {
      massageKey = friends.UserUid + '_' + friends.friendUid;
      console.log('key');
      firebase.database().ref('/users/friendList/' + friends.UserUid + "_" + friends.friendUid).set(friends);
      // friend = false;
    }
  })

  // render already send and recive sms
  let container = document.getElementsByClassName('talkBoxBody')[0];
    firebase.database().ref('users/Messages/' + massageKey + '/').on('value', (data) => {
      if (container.children.length > 0) {
        console.log(container);
        container.innerHTML = "";
      }
      for (const key in data.val()) {
        if (data.val().hasOwnProperty(key)) {
          const element = data.val()[key];
          var div = document.createElement('div');
          div.classList.add('message');
          var Ps = document.createElement('p');
          if (element.uid == firebase.auth().currentUser.uid) {
            div.classList.add('messageSend');
            Ps.classList.add('messageSendText');
            var PsText = document.createTextNode(element.sms);
          } else {
            div.classList.add('messageRecive');
            Ps.classList.add('messageReciveText');
            var PsText = document.createTextNode(element.sms);
          }
          Ps.appendChild(PsText);
          div.appendChild(Ps);
          container.appendChild(div);
        }
      }
      container.scrollTop = container.scrollHeight;
    })
}


// back from chat and go to main page
let goHome = () => {
  let main = document.getElementById('main');
  let talkBox = document.getElementById('talkBox');
  let user_img = document.getElementsByClassName('chatUserimg');
  let container = document.getElementsByClassName('talkBoxBody')[0];
  inputBox = document.getElementById('sendSmsInput');
  inputBox.value = "";
  main.style.display = "flex";
  talkBox.style.display = "none";
  user_img[0].classList.remove('small-img');
  user_img[0].style.backgroundColor = "";
  container.innerHTML = "";
}

// gor sending sms store in data base and update UI
let sendingSms = () => {
  let inputBox = document.getElementById('sendSmsInput');
  let message = inputBox.value;
  inputBox.value = "";
  inputBox.focus();
  // create UI
  if (message != "") {
    // send message into database
    let sms = {
      sms: message,
      uid: firebase.auth().currentUser.uid
    }
    firebase.database().ref('users/Messages/' + massageKey + '/').push(sms);
    // Display UI
    let container = document.getElementsByClassName('talkBoxBody')[0];
    // if (container.children.length > 0) {
    //   container.innerHTML = "";
    // }
    // if (container.children.length == 0) {
    //   firebase.database().ref('users/Messages/' + massageKey + '/').on('value', (data) => {
    //     for (const key in data.val()) {
    //       if (data.val().hasOwnProperty(key)) {
    //         const element = data.val()[key];
    //         var div = document.createElement('div');
    //         div.classList.add('message');
    //         var Ps = document.createElement('p');
    //         if (element.uid == firebase.auth().currentUser.uid) {
    //           div.classList.add('messageSend');
    //           Ps.classList.add('messageSendText');
    //           var PsText = document.createTextNode(element.sms);
    //         } else {
    //           div.classList.add('messageRecive');
    //           Ps.classList.add('messageReciveText');
    //           var PsText = document.createTextNode(element.sms);
    //         }
    //         Ps.appendChild(PsText);
    //         div.appendChild(Ps);
    //         container.appendChild(div);
    //       }
    //     }
    //   })
    // }
    container.scrollTop = container.scrollHeight;
  }
}