
var db = firebase.firestore();  
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


function start() {
  window.open("https://ctfguide.tech/ctflive/client", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=1000,height=400");
}


const socket = io("https://ctfguide.tech");
var username = "";
firebase.auth().onAuthStateChanged(function(user) {


if (user) {
  userid = user.uid;
  useremail = user.email;

      var docRef = db.collection("users").doc(userid);

docRef.get().then(function(doc) {
  if (doc.exists) {
      if (!doc.data().username) {
       username = (useremail).split("@")[0].substring(0, 5)
       
socket.emit("connected", {
  username: username,
  userID: userid,
  gameID: window.location.href.split("/")[4]
});
  } else {
      username = doc.data().username
      
socket.emit("connected", {
  username: username,
  userID: userid,
  gameID: window.location.href.split("/")[4]
});
  }
} 
}).catch(function(error) {
  console.log("Error getting document:", error);
});
  }

});


socket.on('gamestart', function(data){


  if (data.gameID == window.location.href.split("/")[3]) {
  
  var fade= document.getElementById("gamelobby"); 
    
  var intervalID = setInterval(function () { 
        
      if (!fade.style.opacity) { 
          fade.style.opacity = 1; 
      } 
        
        
      if (fade.style.opacity > 0) { 
          fade.style.opacity -= 0.1; 
      }  
        
      else { 
          clearInterval(intervalID); 
          
  document.getElementById("gamelobby").style.display = "none"; 

  document.getElementById("challenge").style.display = "block"; 

  document.getElementById("challenge_etc").style.display = "block"; 
  document.getElementById("cd").innerHTML = data.challenge;



      } 
        
  }, 40); 
} 

  
});




