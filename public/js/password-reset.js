
function reset() {
    var auth = firebase.auth();
    var email = document.getElementById("email").value;
    auth.sendPasswordResetEmail(email).then(function() {
    document.getElementById("resetPassword").innerHTML = "Check your email!"
    }).catch(function(error) {
      // An error happened.
      console.log(error)
    });
}