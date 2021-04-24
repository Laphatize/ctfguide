////////////////// VARIABLES ////////////////////////////
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
let ejs = require('ejs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { response } = require('express');

////////////////////////////////////////////////////////



router.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});



router.get("/con", (request, response) => {
    response.sendFile(__dirname + "/views/connecting.html");
  });
  
  
  
  router.get("/link-account", (request, response) => {
    response.sendFile(__dirname + "/views/link-account.html");
  });
  

  router.get("/admin", (request, response) => {
    response.sendFile(__dirname + "/views/admin.html");
  });
  
  
  router.get("/auth/stibarc", (request, response2) => {
  
  
  
    var sessid = request.query.sess;
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        db.collection('users').where('stibarc_username', '==', xhttp.responseText.split("\n")[0]).get().then(function (querySnapshot) {
  
  
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, '=>', doc.data());
            admin
              .auth()
              .createCustomToken(doc.id)
              .then((customToken) => {
              
              response2.redirect("/con?ct=" + customToken + "&uid=" + doc.id);
            //  return;
      //      response2.send(customToken)
        //    console.log(customToken)
              })
              .catch((error) => {
                console.log('Error creating custom token:', error);
              });
  
          });
  
  
        });
  
  
  
  
  
  
      }
    };
    xhttp.open("GET", `https://api.stibarc.com/getusername.sjs?sess=${sessid}`, true);
    xhttp.send()
  
  });
  
  
  
  
  router.get("/settings", (request, response) => {
    response.sendFile(__dirname + "/views/settings.html");
  });
  router.get("/login", (request, response) => {
    response.sendFile(__dirname + "/views/login.html");
  });
  
  router.get("/password-reset", (request, response) => {
    response.sendFile(__dirname + "/views/password-reset.html");
  });
  router.get("/challenges", (request, response) => {
    response.sendFile(__dirname + "/views/challenges.html");
  });
  
  router.get("/privacy", (request, response) => {
    response.sendFile(__dirname + "/views/privacy.html");
  });
  
  router.get("/tos", (request, response) => {
    response.sendFile(__dirname + "/views/tos.html");
  });

  

router.get("/challenges/:id", async (request, response) => {
  console.log("hit")
    const res = await db.collection('challenges').doc(request.params.id).update({
      views: admin.firestore.FieldValue.increment(1),
    });
  
    const docRef3 = db.collection('challenges').doc(request.params.id);
    const doc3 = await docRef3.get();
  
    if (!doc3.data()) {
      response.send("Challenge does not exist or it may have been removed.");
    }
  
    if (doc3.data().challenge_author) {
      author = doc3.data().challenge_author
    } else {
      author = "Unknown"
    }
  
    var data = {
      "gold": "-",
      "bronze": "-",
      "silver": "-"
    }
    var category = "";
    if (doc3.data().leaderboards_gold) data.gold = doc3.data().leaderboards_gold;
    if (doc3.data().leaderboards_bronze) data.bronze = doc3.data().leaderboards_bronze;
    if (doc3.data().leaderboards_silver) data.silver = doc3.data().leaderboards_silver;
  
    return response.render(__dirname + "/views/challenge-template.ejs", {
      CHALLENGE_NAME: doc3.data().title,
      CHALLENGE_DESCRIPTION: doc3.data().problem,
      CHALLENGE_AUTHOR: author,
      GOLD: data.gold,
      SILVER: data.silver,
      BRONZE: data.bronze
    });
  
    //eturn;
  });
  
  
  
  router.get("/challenges/:id/edit", async (request, response) => {
  
    const docRef3 = db.collection('challenges').doc(request.params.id);
    const doc3 = await docRef3.get();
  
    if (!doc3.data()) {
      response.send("Challenge does not exist or it may have been removed.");
    }
  
    if (doc3.data().challenge_author) {
      author = doc3.data().challenge_author
    } else {
      author = "Unknown"
    }
  
    var data = {
      "gold": "-",
      "bronze": "-",
      "silver": "-"
    }
  
    if (doc3.data().leaderboards_gold) data.gold = doc3.data().leaderboards_gold;
    if (doc3.data().leaderboards_bronze) data.bronze = doc3.data().leaderboards_bronze;
    if (doc3.data().leaderboards_silver) data.silver = doc3.data().leaderboards_silver;
  
    if (!doc3.data().category) {
      category = " none "
    } else {
      category = doc3.data().category;
    }
    var v = doc3.data().views;
    var g = doc3.data().gattempts;
    var a = doc3.data().attempts;
    if (!v) v = 0;
    if (!g) g = 0;
    if (!a) a = 0;
  
    response.render(__dirname + "/views/edit-challenge.ejs", {
      CHALLENGE_NAME: doc3.data().title,
      CHALLENGE_DESCRIPTION: doc3.data().problem,
      CHALLENGE_AUTHOR: author,
      CHALLENGE_DIFFICULTY: doc3.data().difficulty.toLowerCase(),
      GOLD: data.gold,
      SILVER: data.silver,
      BRONZE: data.bronze,
      CHALLENGE_ID: request.params.id,
      CHALLENGE_CATEGORY: category,
      VIEWS: v,
      GATTEMPTS: g,
      ATTEMPTS: a
    });
  });
  
  
  
  
  
  router.get("/register", (request, response) => {
    response.sendFile(__dirname + "/views/register.html");
  });
  
  router.get("/game", (request, response) => {
    response.sendFile(__dirname + "/views/game.html");
  });
  
  router.get("/dashboard", (request, response) => {
   
    response.render(__dirname + "/views/dashboard.ejs", {

    });
  });

////////////////////////////////////////////////////////
module.exports = router;
