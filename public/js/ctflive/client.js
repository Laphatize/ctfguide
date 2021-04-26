
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

function kickPlayer(arg1) {
  socket.emit("kickPlayer", {
    admin: userid,
    person: arg1,
    gameid: window.location.href.split("/")[4]
  })
}

function addPlayer(username) {
  document.querySelector('#egg').insertAdjacentHTML(
      'afterbegin', `  <li>
      <a href="#" class="block hover:bg-white focus:outline-none transition duration-150 ease-in-out">
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="text-1xl leading-5 font-medium text-black truncate">
             ${username}
            </div>
            <div class="ml-2 flex-shrink-0 flex">
          <!--    <span class="inline-flex rounded-md shadow-sm">
                  <button type="button" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                Rename
                  </button>
                </span> -->
                &nbsp;&nbsp;

                <span class="inline-flex rounded-md shadow-sm">
                  <button type="button" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-red-700 bg-white hover:text-red-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
              Remove                   
          </button>
                </span>
            </div>
            
          </div>
        </div>
      </a>
    </li>`)
}

const socket = io(window.location.href.split("/ctflive")[0]);
var username = "";
firebase.auth().onAuthStateChanged(function(user) {


if (user) {
  userid = user.uid;
  useremail = user.email;
  if (user.displayName) {
  } else {
      var docRef = db.collection("users").doc(userid);

docRef.get().then(function(doc) {
  if (doc.exists) {
      if (!doc.data().username) {
       username = (useremail).split("@")[0].substring(0, 5)
       
socket.emit("connected", {
  username: username
});
  } else {
      username = doc.data().username
      
socket.emit("connected", {
  username: username
});
  }
} 
}).catch(function(error) {
  console.log("Error getting document:", error);
});
  }
}
});


socket.on('connected', function(data){
  console.log(data)
  if (data.gameID == window.location.href.split("/")[4]) {
    var participants = JSON.parse(data.participants).participants;
    console.log(participants)
    document.getElementById("egg").innerHTML = "";
    for (var i = 0; i < participants.length; i++) {
      console.log(participants[i])
    addPlayer(participants[i]); 
    }
    console.log(data)
  }


  
});

function gameStart() {
socket.emit("gamestart", {
  gameID: window.location.href.split("/")[4]
});
}

