/*
  Copyright Pranav Ramesh 2020
*/


var db = firebase.firestore();
var userid = ""
var useremail = ""
var isHistoryHidden = false;
document.getElementById("cancelButton").addEventListener("click", cancelGame);
//document.getElementById("findGame").addEventListener("click", gameFound);
document.getElementById("logout").addEventListener("click", logout);
document.getElementById("hidech").addEventListener("click", hidech);
document.getElementById("nothx").addEventListener("click", removeReminder)
document.getElementById("register4email").addEventListener("click", remindWithEmail());


function remindWithEmail() {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ctfguide.tech/api/email-list");
    xhr.send(`userid=${userid}&useremail=${useremail}`)

    // we don't want to keep telling them to sign up lol
    localStorage.setItem("hideReminders", true);
    document.getElementById("reminders").style.display = "none";

}


if (localStorage.getItem("hideReminders")) {
    document.getElementById("reminders").style.display = "none";
}


function removeReminder() {
    document.getElementById("reminders").style.display = "none";
    localStorage.setItem("hideReminders", true);
}


function hidech() {
    if (isHistoryHidden == false) {
    document.getElementById('historyDIV').style.display = 'none'
    document.getElementById('hidech').innerHTML = "Show"
    isHistoryHidden = true;
     } else {
        document.getElementById('hidech').innerHTML = "Hide"
        
        document.getElementById('historyDIV').style.display = 'block'
        isHistoryHidden = false;
     }
}

function logout() {
    firebase.auth().signOut().then(function() {
        window.location.href = "./login"
    })
}

firebase.auth().onAuthStateChanged(function(user) {


if (user) {
    userid = user.uid;
    useremail = user.email;
    if (user.displayName) {
    document.getElementById("name").innerHTML = (user.displayName)
    } else {
        var docRef = db.collection("users").doc(userid);

docRef.get().then(function(doc) {
    if (doc.exists) {
        if (!doc.data().username) {
            document.getElementById("name").innerHTML = (user.email).split("@")[0].substring(0, 5)
        } else {
          username = doc.data().username
          document.getElementById("name").innerHTML = username;
        }
    } 
}).catch(function(error) {
    console.log("Error getting document:", error);
});
    }



    var docRef = db.collection("users").doc(user.uid);

    docRef.get().then(function(doc) {
       // console.log(doc)
        if (doc.exists) {   

            console.log("Document data:", doc.data());
            document.getElementById("points").innerHTML = doc.data().points;
         //   document.getElementById("duelvictories").innerHTML = doc.data().victories;
         //   document.getElementById("rank").innerHTML = doc.data().rank;
        
            var usersRef = db.collection("users").doc(userid)
            usersRef.get(userid).then(function(doc) {
                if (doc.data().beta == "true") {
                    document.getElementById("socialbutton").classList.remove("hidden")
                }
                if(!doc.data().identifier) {
                    console.log("Legacy Account Detected! Now updating...")
                    setIdenitifier();
                } else  {
                    document.getElementById("usernameBig").innerHTML = doc.data().username
                    document.getElementById("tag").innerHTML = doc.data().identifier.split("#")[1]

                    for (var i = 0; i < doc.data().friend_requests.length; i++) {
                        document.querySelector('#requests').insertAdjacentHTML(
                            'beforebegin', `
                            
                      
            <li class="border-t border-gray-200">
            <a href="#" class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
              <div class="px-4 py-6 sm:px-6">
                <div class="flex items-center justify-between">
                  <div style="font-size: 1.4rem;" class="text-sm leading-5 font-medium text-black ">
                    <i title="You won't be able to see info about this user until you accept their friend request." class="fas fa-question bg-gray-100 px-3 py-2 rounded-full" style="color:darkgray;"></i>  <span class="ml-3">laphatize</span> <span style="color:gray;" title="Private">●</span>
                  </div>
                 
                  <div class="ml-2 flex-shrink-0 flex">
                  <button class="px-4 py-1 inline-flex rounded-lg bg-green-500 hover:bg-green-600 text-white">
              Accept 
                 </button>
                    <button class="ml-4 px-4 py-1 inline-flex rounded-lg bg-red-500 hover:bg-red-600 text-white">
                     Decline
                    </button>
                  </div>
                </div>
              
              </div>
            </a>
          </li>
              
                      
                            
                            
                            `);
                    }
                }
               
                if (doc.data().viewing) {
                    console.log(doc.data().viewing)
                    var id = doc.data().viewing
                    var docRef2 = db.collection("challenges").doc(id);

                    docRef2.get().then(function(doc) {
                        console.log(doc.data().title)
                        document.getElementById("challenge_name").innerHTML = doc.data().title
                        document.getElementById("challenge_link").href = "../../challenges/" + id;
                    });
                
                } else {
                    document.getElementById("lastworkingon").style.display = "none";
                }











                if (doc.data().challenges){
                doc.data().challenges.forEach(id => {

                    var docRef2 = db.collection("challenges").doc(id);

                    docRef2.get().then(function(doc) {
    
                        if (doc.exists) {
                            document.querySelector('#mc').insertAdjacentHTML(
                                'beforebegin', `
                                
                                <tr  id="mc" class="bg-white hover:bg-gray-100">
                             <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
               ${id}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 px-6 py-4  text-sm leading-5 text-gray-500">
                   ${doc.data().title}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 px-6 py-4 text-sm leading-5 text-white  w-10">
                      <a href="./challenges/${id}" class="bg-gray-600 hover:bg-gray-700 px-10 py-2 rounded">View Challenge</a>
                      <a href="./challenges/${id}/edit" class="bg-gray-600 hover:bg-gray-700 px-10 py-2 rounded">Edit Challenge</a>

                        </td>
                              
                          
                              </tr>
                  
                          
                                
                                
                                `);
                        }
                    });

                })
            }
               
            })

            if (doc.data().challenges){
           var challenges = new Promise((resolve, reject) => {
            doc.data().solved.forEach(id => {

                



                var docRef2 = db.collection("challenges").doc(id);

                docRef2.get().then(function(doc) {

                    if (doc.exists) {

                    document.querySelector('#history').insertAdjacentHTML(
                        'beforebegin', `
                        <tr id="history" class="bg-white hover:bg-gray-100">
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
               ${id}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                   ${doc.data().title}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-white w-10">
                      <a href="./challenges/${id}" class="bg-gray-600 hover:bg-gray-700 px-10 py-2 rounded" >View Challenge</a>
                        </td>
                      
                  
                      </tr>
                  
                        
                        
                        `);
                    }

                });






            })
            resolve('okay')
        
            
        })
        
   
        challenges.then(value => {
            showStuff()
        })

    } else {
        showStuff();
    
    }
            

        } else {
      
                        
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    window.location.href = "./dashboard"
                } else {
                    window.location.href = "./dashboard"
                }
            };
            xhttp.open("GET", `../api/inituser?id=${userid}`, true);
            xhttp.send();
   
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });



} else {
    window.location.href = "./login"
}
});


function gameFound() {
    document.getElementById("gameFound").style.display = "block";
}

function cancelGame() {
    document.getElementById("gameFound").style.display = "none";

}


function showStuff() {
    
    document.getElementById("loader").style.display = "none";
    document.getElementById("page_content").style.display = "block";
}


/* 

    Code for the Side Bar

*/
function showOverview() {
    document.getElementById("overview").style.display = "block";
    document.getElementById("social").style.display = "none"
    document.getElementById("overviewbutton").classList = "group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
    document.getElementById("socialbutton").classList = "group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition ease-in-out duration-150"

}

function showSocial() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("social").style.display = "block";
    document.getElementById("socialbutton").classList = "group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
    document.getElementById("overviewbutton").classList = "group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition ease-in-out duration-150"
}


/*

    This is for accounts made before the social features were introduced.
    These accounts don't have identifiers, so we have to set it for them when 
    they login.

    To the clever people looking at the code. No this will not allow you to 
    change your ID again if you've already gotten one. 

    The reason we don't make it so you can change your ID, is it will essentially
    wipe your friends list.

    Your identifier is essentially your public tracking id. 
    Your user id is your private tracking id.


*/
function setIdenitifier(uid) {
    var request = new XMLHttpRequest();
    request.open("POST", "../../api/setidentifier")
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    console.log(userid)
    request.send(`uid=${userid}`);
    
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
    
            console.log(request.responseText);
      }
    }
}




function addFriend() {
    var identifier = document.getElementById("friendbox").value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../api/friendrequest")
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    xhr.send(`identifier=${identifier}`)

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
    
            console.log(xhr.responseText);
      }
    }
}
