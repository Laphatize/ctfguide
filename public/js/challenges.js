/*
 Copyright Pranav Ramesh 2020
*/


var db = firebase.firestore();
document.getElementById("difficulty").addEventListener("change", update, false);
document.getElementById("createlisting").addEventListener("click", showmodal);
document.getElementById("createlisting2").addEventListener("click", createlisting);
document.getElementById("cancel").addEventListener("click", hidemodal);
document.getElementById("logout").addEventListener("click", logout);
document.getElementById("setusername").addEventListener("click", setUsername);
var username = ""
var userid = ""
firebase.auth().onAuthStateChanged(function(user) {

userid = user.uid

var docRef = db.collection("users").doc(userid);

docRef.get().then(function(doc) {
    if (doc.exists) {
        if (!doc.data().username) {
          document.getElementById("setup").style.display = "block";
        } else {
          username = doc.data().username
        }
    } 
}).catch(function(error) {
    console.log("Error getting document:", error);
});



});
function openChallenge(id) {
  window.location.href = "./challenges/" + id;
}


function logout() {
    firebase.auth().signOut().then(function() {
        window.location.href = "./login"
    })
}
function createlisting() {
  var challengeName = document.getElementById("cname").value;
  var challengeInstructions = document.getElementById("cid").value;
  var challengeDifficulty = document.getElementById("cdifficulty").value.toLowerCase();
  var category = document.getElementById("category").value.toLowerCase();

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://ctfguide.tech/api/createchallenge")
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(`uid=${userid}&solution=${document.getElementById("solution").value}&category=${category}&difficulty=${challengeDifficulty}&title=${challengeName}&problem=${challengeInstructions}&challenge_author=${username}`)
    
    hidemodal()
    if (localStorage.getItem("difficulty")) {
      document.getElementById("difficulty").value = localStorage.getItem("difficulty").charAt(0).toUpperCase() + localStorage.getItem("difficulty").slice(1);
      loadChallenges(localStorage.getItem("difficulty"))

    } else {

    
    loadChallenges("easy")
    }
  /*
dnu because of security concerns
  db.collection("challenges").add({
    category: category,
    difficulty: challengeDifficulty,
    title: challengeName,
    problem: challengeInstructions,
    challenge_author: username
})
*/







}

function setUsername() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload();
    }
  }
  xhttp.open("GET", `./api/setusername?uid=${userid}&username=${document.getElementById("username").value}`, true);
xhttp.send();
}



function showmodal() {
  document.getElementById("create").style.display = "block";
}

function hidemodal() {
  document.getElementById("create").style.display = "none";

}
function add(name, category, difficulty, id, solved) {
  
    if (difficulty == "hard") {
    document.querySelector('#challenge-grid').insertAdjacentHTML(
        'beforebegin', `
        
        <li id="${id}" class="col-span-1 bg-white border   shadow-lg">
        <div class="w-full flex items-center justify-between p-6 space-x-6">
          <div class="flex-1 truncate">
            <div class="flex items-center space-x-3">
              <h3 class="text-gray-900 text-sm leading-5 font-medium truncate">${name}</h3>
              <span class="flex-shrink-0 inline-block px-2 py-0.5 text-white text-xs leading-4 font-medium bg-red-400 rounded-full">HARD</span>
            </div>
            <p class="mt-1 text-gray-500 text-sm leading-5 truncate">${category}</p>
        
            </div>
            <button onclick="openChallenge('${id}')" class="bg-gray-800 px-3 py-1 text-white"><i class="fas fa-eye"></i> View</button>
            </div>
      
      </li>
  
        
        
        `);
    }

    
    if (difficulty == "medium") {
        document.querySelector('#challenge-grid').insertAdjacentHTML(
            'beforebegin', `
            
            <li  id="${id}" class="col-span-1 bg-white border   shadow-lg">
            <div class="w-full flex items-center justify-between p-6 space-x-6">
              <div class="flex-1 truncate">
                <div class="flex items-center space-x-3">
                  <h3 class="text-gray-900 text-sm leading-5 font-medium truncate">${name}</h3>
                  <span class="flex-shrink-0 inline-block px-2 py-0.5 text-white text-xs leading-4 font-medium bg-yellow-400 rounded-full">MED</span>
                </div>
                <p class="mt-1 text-gray-500 text-sm leading-5 truncate">${category}</p>
              </div>
              <button onclick="openChallenge('${id}')" class="bg-gray-800 px-3 py-1 text-white"><i class="fas fa-eye"></i> View</button>
           </div>
          </li>
      
            
            
            `);
        }

        if (difficulty == "easy") {
            document.querySelector('#challenge-grid').insertAdjacentHTML(
                'beforebegin', `
                
                <li  id="${id}" class="col-span-1 bg-white border   shadow-lg">
                <div class="w-full flex items-center justify-between p-6 space-x-6">
                  <div class="flex-1 truncate">
                    <div class="flex items-center space-x-3">
                      <h3 class="text-gray-900 text-sm leading-5 font-medium truncate">${name}</h3>
                      <span class="flex-shrink-0 inline-block px-2 py-0.5 text-white text-xs leading-4 font-medium bg-green-400 rounded-full">EASY</span>
                    </div>
                    <p class="mt-1 text-gray-500 text-sm leading-5 truncate">${category}</p>
                  </div>
                  <button onclick="openChallenge('${id}')" class="bg-gray-800 px-3 py-1 text-white"><i class="fas fa-eye"></i> View</button>
               </div>
              </li>
          
                
                
                `);
            }

            if (solved) {
              document.getElementById(id).classList.remove("bg-white");
              document.getElementById(id).classList.add("bg-green-100");

            }

    }



    function loadChallenges(difficulty) {
      
      document.getElementById("orgin-grid").innerHTML = `<li style="display:none;" id="challenge-grid" class="col-span-1 bg-white border   shadow-lg">
          <div class="w-full flex items-center justify-between p-6 space-x-6">
            <div class="flex-1 truncate">
              <div class="flex items-center space-x-3">
              </div>
         </div>
        </li>`

        // get challenges we completed
      

    var docRef3 = db.collection("users").doc(userid);

    docRef3.get().then(function(doc3) {

      db.collection("challenges").where("difficulty", "==", difficulty)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              if (!doc3.data().solved || !doc3.data().solved.includes(doc.id)) {
              add(doc.data().title, doc.data().category, doc.data().difficulty, doc.id)
              } else {
                add(doc.data().title, doc.data().category, doc.data().difficulty, doc.id, true)

              }
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

    });

    }



    function update() {
      loadChallenges(document.getElementById("difficulty").value.toLowerCase())
      localStorage.setItem("difficulty", document.getElementById("difficulty").value.toLowerCase());
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        if (localStorage.getItem("difficulty")) {
          document.getElementById("difficulty").value = localStorage.getItem("difficulty").charAt(0).toUpperCase() + localStorage.getItem("difficulty").slice(1);
          loadChallenges(localStorage.getItem("difficulty"))

        } else {

        
        loadChallenges("easy")
        }
      
      
      } else {
          //window.location.href = "./login"
      }
      });
      
      if (localStorage.getItem("discordReminder") == "hide") {
        document.getElementById("discord").style.display = "none";
      }