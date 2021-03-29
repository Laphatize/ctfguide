var userid = ""
var username = "";
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userid = user.uid;
       
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

        

        var docRef = db.collection("users").doc(user.uid);

        docRef.get().then(function(doc) {
            if (doc.data().challenges.includes(  window.location.href.split("/")[4] )) {
            document.getElementById("creator").style.display = "block";
            document.getElementById("adminlink").href = 
            `./${window.location.href.split("/")[4]}/edit`
            }
        });



        statusUpdate();






    }

});
document.getElementById("cd").innerHTML = document.getElementById("cd").innerHTML.replace(/\\n|\\r\\n|\\n\\r|\\r/g, '<br>');
document.getElementById("check").addEventListener("click", submit)
document.getElementById("cancel").addEventListener("click", hide)
document.getElementById("submitreport").addEventListener("click", submitr)


function statusUpdate() {
var request = new XMLHttpRequest();
request.open("POST", "../../api/lastviewed")
request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
console.log(userid)
request.send(`uid=${userid}&id=${window.location.href.split("/")[4]}`);

request.onreadystatechange = function () {
  if (request.readyState == 4 && request.status == 200) {

        console.log("synced with server")
  }
}
}






function submitr() {
    var request = new XMLHttpRequest();
  request.open("POST", "https://discord.com/api/webhooks/773796502408790016/KNNR7RReVEa-o-WtHLVy1sidsl6M1bZtWBXwVRBqS9pbRoRegoDTJbJBGcYTYUPLOSfr");

    request.setRequestHeader('Content-type', 'application/json');

    var params = {
        username: "New Report: " + userid,
        content: "Reason for Report: " +  document.getElementById("rreason").value + "\nChallenge ID: `" + window.location.href.split("/")[4] + "`\n" + window.location.href
    }

    request.send(JSON.stringify(params));

    document.getElementById("msg").innerHTML = "Thank you for your report. We will make sure this CTF conforms to our rules.<br><br><a class='px-2 py-2 bg-gray-100' href='../challenges'>View other challenges</a>"
    document.getElementById("tinynav").style.display = "none";

}


function hide() {
    document.getElementById("report").style.display = "none";

}
function report() {

    document.getElementById("report").style.display = "block";

}


function submit () {



var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // window.alert(xhttp.response)
        if (xhttp.response == "good") {
            return document.getElementById("goodjob").style.display = "block";
        } else {
            document.getElementById("notification").style.display = "block";
        }
    } else {
        //document.getElementById("notification").style.display = "block";
    }
};
xhttp.open("GET", `../api/checksolution?username=${username}&id=${window.location.href.split("/")[4]}&solution=${document.getElementById("solution").value}&uid=${userid}`, true);
xhttp.send();
}
