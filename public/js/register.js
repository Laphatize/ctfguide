/*
  Copyright Pranav Ramesh 2020
*/

document.getElementById("registerButton").addEventListener("click", register);


function register() {
    if (document.getElementById("password").value != document.getElementById("confirmpassword").value) {
        return window.alert("Password confirmation must match.")
    }
    firebase.auth().createUserWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        window.alert(errorMessage);
      });
}



firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
        window.location.href = "./dashboard"
    }

});