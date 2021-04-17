
const db = firebase.firestore();
function account() {
  document.getElementById("account").style.display = "block";
    document.getElementById("integrations").style.display = "none";
    document.getElementsByClassName("account")[0].classList.add("bg-gray-50");
    document.getElementsByClassName("integrations")[0].classList.remove("bg-gray-50");
}
  function integrations() {
    document.getElementById("account").style.display = "none";
    document.getElementById("integrations").style.display = "block";
    document.getElementsByClassName("account")[0].classList.remove("bg-gray-50");
    document.getElementsByClassName("integrations")[0].classList.add("bg-gray-50");
    document.getElementsByClassName("account")[0].classList.add("hover:bg-gray-50");


  }


  var userid = ""
  var email = ""
firebase.auth().onAuthStateChanged(function(user) {

userid = user.uid
email = user.email;
var docRef = db.collection("users").doc(userid);

docRef.get().then(function(doc) {
    if (doc.exists) {

          username = doc.data().username
          if (doc.data().stibarc_username) {
           
            document.getElementById("stibarc_username").innerHTML = "Linked"
            document.getElementById("stibarc_usernamebtn").style.display = "none";
          } 

          document.getElementById("username").value = username;
          console.log(doc.data().beta)

          if (doc.data().beta == "true") document.getElementById("beta").checked = true;

          document.getElementById("loader").style.display = "none"
          document.getElementById("account").style.display = "block"
    } 
}).catch(function(error) {
    console.log("Error getting document:", error);
    
});
});

var open1 = false;


function toggleMenu() {
  // closem openm
  if (open1 == false) {
  document.getElementById("mobile").classList.add("block")
  document.getElementById("mobile").classList.remove("hidden")
  document.getElementById("closem").classList.remove("hidden")
  document.getElementById("closem").classList.add("block")
  document.getElementById("openm").classList.add("hidden")
  document.getElementById("openm").classList.remove("block")


    open1 = true;
  } else {
    document.getElementById("mobile").classList.add("hidden")
  document.getElementById("mobile").classList.remove("block")
  open1 = false;
  document.getElementById("openm").classList.remove("hidden")
  document.getElementById("openm").classList.add("block")
  document.getElementById("closem").classList.add("hidden")
  document.getElementById("closem").classList.remove("block")
  }

}
document.getElementById("menubtn").addEventListener("click", toggleMenu);



function go() {
    
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload();
    }
  }
  xhttp.open("GET", `./api/setusername?uid=${userid}&username=${document.getElementById("username").value}`, true);
xhttp.send();

    
var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload();
    }
  }
  xhttp.open("GET", `./api/beta?uid=${userid}&join=${document.getElementById('beta').checked}`, true);
xhttp.send();


}



function copyid() {
    var str = userid;
    const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  document.getElementById("copy").innerHTMl = "Copied! DO NOT SHARE THIS WITH ANYONE!"
}




function moveacc() {
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        logout();
      }
    }
    xhttp.open("GET", `./api/reauthorize?uid=${userid}&newuid=${document.getElementById("newuid").value}`, true);
  xhttp.send();

  
  }







function reset() {
var auth = firebase.auth();
auth.sendPasswordResetEmail(email).then(function() {
document.getElementById("resetbutton").innerHTML = "Check your email!"
}).catch(function(error) {
  // An error happened.
  console.log(error)
});
}


function logout() {
    firebase.auth().signOut().then(function() {
        window.location.href = "./login"
    })
}


