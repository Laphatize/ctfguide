
    var db = firebase.firestore();
    var userid = "";
    document.getElementById("schanges").addEventListener("click", editProblem)
    document.getElementById("ctflivechanges").addEventListener("click", saveChanges)



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userid = user.uid;
        var docRef2 = db.collection("users").doc(userid);
        docRef2.get().then(function(doc) {

    if (!doc.data().challenges.includes(window.location.href.split("/")[4])) {
      window.location.href = "https://ctfguide.tech/dashboard"
    }
  });
    } else {
      window.location.href = "https://ctfguide.tech/login"
    }
    });

    

   
function saveChanges() {


  var flag1 = document.getElementById("f1").value;
  var flag2 = document.getElementById("f2").value;
  var flag3 = document.getElementById("f3").value;

  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

      }
    };
  xhttp.open("GET", `../../ctflive/config?flag1=${flag1}&flag2=${flag2}&flag3=${flag3}&uid=${userid}&id=${window.location.href.split("/")[4]}`, true);
  xhttp.send();
}

    async function deleteChallenge() {
      var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ctfguide.tech/api/deletechallenge")
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

 xhr.send(`uid=${userid}&id=${window.location.href.split("/")[4]}`);
 window.location.href = "https://ctfguide.tech/dashboard"
    }
async function editProblem() {
    var challengeName = document.getElementById("cname").value;
    var solution = document.getElementById("solution").value;
    var challengeDesc = document.getElementById("cid").value;
    var category = document.getElementById("category").value;
    var difficulty = document.getElementById("cdifficulty").value;
    var id = window.location.href.split("/")[4];
    var authorid = userid;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "../../api/editchallenge")
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

 xhr.send(`category=${category}&problem=${challengeDesc}` +
    `&difficulty=${difficulty}&title=${challengeName}` +
    `&solution=${solution}&id=${id}&uid=${authorid}`);

    window.location.href = "https://ctfguide.tech/challenges/" + id
}