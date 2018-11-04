(function () {
  
  
    document.getElementById("btn_signup").addEventListener('click', signup, false);
    document.getElementById("btn_login").addEventListener('click', login, false);
  
    requestNotificationPermission();
  
  CKEDITOR.replace('editor1');

  document.getElementById('btn_publish').addEventListener('click', publishPost, false);

  let blogpostRef = firebase.database().ref('posts/');
  blogpostRef.on('value', function (snapshot) {
    document.getElementById("blogposts").innerHTML = '';
    snapshot.forEach(function (data) {
      showPost(data.val());
    });
  });
})();
  
  function signup(e) {
    e.preventDefault();
    
    
    let email = document.getElementById("signup_email").value;
    let password = document.getElementById("signup_password").value;
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (response) {
      sendNotification('Thanks for signing up to our website! Check your e-mail for account verification!');
      sendVerificationEmail(response.user);
      
    })
      .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
  
      console.log(errorCode, errorMessage);
      document.getElementById('signup_error').innerHTML = errorCode + " - " + errorMessage;
    });
  }
  
  function login(e) {
    e.preventDefault();
  
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (response) {
      sendNotification('You are now logged in successfully!');
      showUserInfo(response.user);

    })
      .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
  
      console.log(errorCode, errorMessage);
      document.getElementById('login_error').innerHTML = errorCode + " - " + errorMessage;
    });
  }
  
  function sendVerificationEmail(user) {
    user.sendEmailVerification()
      .then(function () {
      // Email sent.
      document.getElementsByTagName('form')[0].reset();
    }).catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
  
      console.log(errorCode, errorMessage);
    });
  }
  
  function sendNotification(msg) {
    let notif = new Notification(msg);
  }
  
  function requestNotificationPermission() {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission(function (permission) {
        if (!('permission' in Notification)) {
          Notification.permission = permission;
        }
      });
    }
  }
  
  function showUserInfo(user) {
    document.getElementById('user_info').innerHTML = "<h1> Welcome " + user.email + " ! </h1>";
    
    document.getElementsByTagName('form')[1].reset();
    hide();
  }
  function publishPost(e) {
    e.preventDefault();
  
    let title = document.getElementById("title").value;
    let content = CKEDITOR.instances.editor1.getData();
    let datetime = new Date().toLocaleString();
  
    firebase.database().ref('posts/').push({
      title: title,
      content: content,
      publishedOn: datetime
    });
    sendNotification("Publish blogpost succeed!");
  }
  
  function showPost(post) {
    let elem = document.createElement('div');
    elem.className = 'blogpost';
    elem.innerHTML = "<h2 class=\"title\">" + post.title + "</h2>" + "<p>Published on " + post.publishedOn + "</p><hr>" + post.content
  
    document.getElementById("blogposts").appendChild(elem);
  }
  function hide(){
    document.getElementById("login_container").className = "hide";
    document.getElementById("editor").className = "";
  }
  