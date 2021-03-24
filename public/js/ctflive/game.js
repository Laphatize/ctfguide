
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


// Check submission buttons
document.getElementById("cs1").addEventListener("click", function() {
  checkFlag(document.getElementById("flag1").value, "1")
});

document.getElementById("cs2").addEventListener("click", function() {
  checkFlag(document.getElementById("flag2").value, "2")
});

document.getElementById("cs3").addEventListener("click", function() {
  checkFlag(document.getElementById("flag3").value, "3")
});

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

    
// Intialize playaer upon page load
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      if (xhttp.responseText == "OK") {
        console.log("%c DO NOT SHARE THIS INFORMATION WITH ANYONE EVER AND DO NOT TYPE IN CODE HERE THAT YOU DON'T UNDERSTAND!", "font-weight: bold; font-size: 50px;color: red;")
        console.log("User ID: " + userid)
        console.log("[DEBUG] User intialized onto leaderboards.")
      }

    }
};
xhttp.open("GET", `../../ctflive/initPlayer?userid=${userid}&gameid=${window.location.href.split("/")[4]}`, true);
xhttp.send();



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
     
          participants = JSON.parse(data.participants);
          console.log(participants)

          for (var i = 0; i < participants.participants.length; i++) {
            document.querySelector('#egg').insertAdjacentHTML(
              'afterbegin', `            <tr class="bg-white">
              <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
${participants.participants[i]}
              </td>
    
              <td id="${participants.participants[i]}_checkpoint" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              <i class="fas fa-circle-notch fa-spin"></i>
              Checkpoint 0
              </td>
      

            </tr>`)
          }
      



      } 
        
  }, 40); 
} 

  
});


function checkFlag(flag, flagFor) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
     

        if (xhttp.responseText == "OK") {
          var duration = 4 * 1000;
          var animationEnd = Date.now() + duration;
          var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
          
          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }
          
          var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
          
            if (timeLeft <= 0) {
              return clearInterval(interval);
            }
          
            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
          }, 250);

          document.getElementById("cs" + flagFor).innerHTML = "👏 Solved!"

          socket.emit("ssbroadcast", {
            gameid: window.location.href.split("/")[4]
          });

        }


      }
  };
  xhttp.open("GET", `../../ctflive/checkFlag?userid=${userid}&flag=${flag}&gameid=${window.location.href.split("/")[4]}&flagfor=${flagFor}`, true);
  xhttp.send();

  
}



   

socket.on('sstransit', function(data){
console.log(data.leaderboards)
var leaderboards = JSON.parse(data.leaderboards).leaderboard
var participants = JSON.parse(data.participants).participants;
document.getElementById("egg").innerHTML = `
<thead>
              <tr>
                <th class="px-6 py-3 bg-gray-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                  Name
                </th>
      
                <th class="px-6 py-3 bg-gray-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                 Status
                </th>
              </tr>
            </thead>
            
            <tbody>
              <!-- Odd row -->
              <tr style="display:none;" class="bg-white egg">
                <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
     this
                </td>
           
                <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                 work yet
                </td>
        

              </tr>
  
       
            </tbody>`

            for (var i = 0; i < participants.length; i++) {

            document.querySelector('#egg').insertAdjacentHTML(
              'afterbegin', `            <tr class="bg-white">
              <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
${participants[i]}
              </td>
      
              <td id="checkpoint" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              <i class="fas fa-circle-notch fa-spin"></i>
              Checkpoint ${leaderboards[participants[i]]}

              </td>
      

            </tr>`)
            }


console.log(participants.length)
});


