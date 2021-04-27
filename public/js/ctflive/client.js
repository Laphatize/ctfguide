
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
        <div class="px-4 py-2 sm:px-6">
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
                  <button onclick="kickPlayer('${username}')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 hover:bg-gray-100 text-xs leading-4 font-medium rounded text-red-700 bg-white hover:text-red-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
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
firebase.auth().onAuthStateChanged(function (user) {


  if (user) {
    userid = user.uid;
    useremail = user.email;
    if (user.displayName) {
    } else {
      var docRef = db.collection("users").doc(userid);

      docRef.get().then(function (doc) {
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
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
  }
});


socket.on('connected', function (data) {
  console.log(data)
  if (data.gameID == window.location.href.split("/")[4]) {
  //  var participants = JSON.parse(data.participants).participants;
   // console.log(participants)
    //document.getElementById("egg").innerHTML = "";
    //for (var i = 0; i < participants.length; i++) {
     // console.log(participants[i])
      //addPlayer(participants[i]);
      refresh() 
    }
    console.log(data)
  



});

function gameStart() {
  socket.emit("gamestart", {
    gameID: window.location.href.split("/")[4],
    uid: userid
  });

  //document.getElementById("gamemodal").style.display = "none"
}

function refresh() {
  socket.emit("refresh", {
    gameID: window.location.href.split("/")[4]
  })
}

var cp0 = 0, cp2 =0, cp3 = 0, cp1 =0;
socket.on('refreshed', function (data) {
  console.log(data)
  var participants = JSON.parse(data.participants).participants;
  console.log(participants)
  document.getElementById("egg").innerHTML = "";

  cp0 = 0
   cp2 =0
   cp3 = 0
    cp1 =0
  var leaderboards = JSON.parse(data.leaderboards).leaderboard
  
  for (var i = 0; i < participants.length; i++) {
    console.log(participants[i])
    
    addPlayer(participants[i]);
    
    if (leaderboards[participants[i]] == 0) {
      cp0++;
    }

    if (leaderboards[participants[i]] == 1) {
      cp1++;
    }

    if (leaderboards[participants[i]] == 2) {
      cp2++;
    }

    
    if (leaderboards[participants[i]] == 3) {
      cp3++;

     
    }

    myChart.data.datasets[0].data[0] = cp0;
    myChart.data.datasets[0].data[1] = cp1;
    myChart.data.datasets[0].data[2] = cp2;
    myChart.data.datasets[0].data[3] = cp3;


    myChart.update()
  }
})

refresh()

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Not Started', 'Checkpoint 1', 'Checkpoint 2', 'Checkpoint 3'],
        datasets: [{
            label: '# of Participants',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
              ticks: {
                beginAtZero: true,
                callback: function (value) { if (Number.isInteger(value)) { return value; } },
                stepSize: 1
            }
          }
        }
    }
});