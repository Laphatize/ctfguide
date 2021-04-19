/*
  Copyright Pranav Ramesh 2020
*/

document.getElementById("loginButton").addEventListener("click", login);



function login() {
    firebase.auth().signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage)
        
    });
}


firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if ( urlParams.get('returnTo'))  {
            window.location.href =  urlParams.get('returnTo');
        } else {
            window.location.href = "./dashboard"
        }
    }

});

var input = document.getElementById("password");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("loginButton").click();
    }
});

function lws() {
    window.open("https://stibarc.github.io/stibarc_redesign/oauth-test", " ", "menubar=no,location=no,resizable=no,scrollbars=yes", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=400,height=400");

}
        