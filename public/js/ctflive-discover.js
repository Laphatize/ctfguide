
  var open1 = false;
var userid=""
var username = ""
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              userid = user.uid;
              useremail = user.email;
              
  //loadChallenges("easy");
  
  
              
var docRef = db.collection("users").doc(userid);

docRef.get().then(function(doc) {
    if (doc.exists) {
        if (!doc.data().username) {
      window.location.href = "../../challenges"
        } else {
          username = doc.data().username
          document.getElementById("username").innerHTML = username;
        }
    } 
}).catch(function(error) {
    console.log("Error getting document:", error);
});

            }
  });
  
  
  
  
  
  
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
  document.getElementById("showGames").addEventListener("click", chooseGame);
  
  
  function start() {
    window.location.href = "https://ctfguide.tech/ctflive/client";
  }
  
  
  function chooseGame() {
    document.getElementById("about").style.display = "none";
    document.getElementById("discover").style.display = "block";

  }
  
  
  
  
  
  
  
  function creategame(arg1) {
    var cid = arg1
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
         if (xhttp.responseText == "error") {
          window.alert("error")
         } else {
            window.location.href = `./${xhttp.responseText}/client`
         }
        }
    };
    xhttp.open("GET", `./create-game?cid=${cid}&uid=${userid}`, true);
    xhttp.send();
  }
  
  function joingame() {
    document.getElementById("gamebutton").innerHTML = `<i class="fas fa-spinner fa-spin"></i></span>`
    var code = document.getElementById("gamecode").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "Game not found.") {
               /// window.alert("Game not found!")
                document.getElementById("error").style.display = "block"
                document.getElementById("gamebutton").innerHTML = `  Join as&nbsp;<span>${username}</span></span>`
            } else {
                window.location.href = `./${code}/game`
                document.getElementById("gamebutton").innerHTML = `  Join as&nbsp;<span>${username}</span></span>`

            }
         }

        }
        
    xhttp.open("GET", `../../ctflive/check/${code}`, true);
    xhttp.send();


   // window.location.href = `./${code}/game`
  }
  
  function hidegamemodal() {
    document.getElementById("gamemodal").style.display = "none";
  }
  function showgamemodal() {
    document.getElementById("gamemodal").style.display = "block";
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
            <button onclick="creategame('${id}')" class="bg-gray-800 px-3 py-1 text-white"><i class="far fa-play-circle"></i> Start Game</button>

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
              <button onclick="creategame('${id}')" class="bg-gray-800 px-3 py-1 text-white"><i class="far fa-play-circle"></i> Start Game</button>
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
                  <button onclick="creategame('${id}')" class="bg-gray-800 px-3 py-1 text-white"><i class="far fa-play-circle"></i> Start Game</button>
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
        
  
        db.collection("challenges").where("ctflive_enabled", "==", true)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
             
                add(doc.data().title, doc.data().category, doc.data().difficulty, doc.id)
             
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
  
    
      }

      loadChallenges()