
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


const socket = io(window.location.href.split("/ctflive")[0]);
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

var participants;
socket.on('gamestart', function(data){


  if (data.gameID == window.location.href.split("/")[4]) {
  
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
          // document.getElementById("cd").innerHTML = data.gameID;

          document.getElementById("cd").innerHTML = data.challenge;
          window.alert(data.participants)
          
          participants = JSON.parse(data.participants);
          console.log(participants)

          for (var i = 0; i < participants.participants.length; i++) {
            document.querySelector('#egg').insertAdjacentHTML(
              'afterbegin', `            <tr class="bg-white">
              <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
${participants.participants[i]}
              </td>
              <td id="${participants.participants[i]}_checkpoint" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
0              </td>
              <td id="${participants.participants[i]}_checkpoint" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              <i class="fas fa-circle-notch fa-spin"></i>
              Checkpoint 1
              </td>
      

            </tr>`)
          }
      



      } 
        
  }, 40); 
} 

  
});


function checkFlag(flag) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange() = function() {
    if (this.readState == 4 && this.status == 200) {

    }
  }

  var gamecode;
  xhttp.open("POST", `../../ctflive/checkFlag?gameCode=${gamecode}&token=${userid}`)
}



