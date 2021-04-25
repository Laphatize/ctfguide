////////////////// VARIABLES ////////////////////////////
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
let ejs = require('ejs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { response } = require('express');

////////////////////////////////////////////////////////


/*
================
  STATIC PAGES
================
  */


// Home Page
router.get("/", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/site/index.html");
});

// Register Page
router.get("/register", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/authentication/register.html");
});

// Settings Page
router.get("/settings", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/site/settings.html");
});

// Login Page
router.get("/login", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/authentication/login.html");
});

// Password Reset Page
router.get("/password-reset", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/authentication/password-reset.html");
});

// Challenges Page
router.get("/challenges", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/site/challenges.html");
});

// Privacy Page
router.get("/privacy", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/legal/privacy.html");
});

// Terms of Service Page
router.get("/tos", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/legal/tos.html");
});


/*
======================
  INTEGRATION PAGES:
======================
*/

// Page for client to authenticate with custom auth token.
router.get("/con", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/authentication/connecting.html");
});


// Confirmation page for linking STiBaRC to CTFGuide
router.get("/link-account", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/static/authentication/link-account.html");
});


// Admin Page (Still being worked on)
router.get("/admin", (request, response) => {
  response.status(200).sendFile(__dirname + "/views/admin/admin.html");
});


// STiBaRC OAuth Callback
// This will grab the username using the session key provided in the URL parameters and store it to the database.
router.get("/auth/stibarc", (request, response2) => {
  console.log(`[DEBUG] A new stibarc login has started. ${request.query.sess}`)
  var sessid = request.query.sess;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("[DEBUG] Stibarc has provided username! " + xhttp.responseText.split("\n")[0])
      db.collection('users').where('stibarc_username', '==', xhttp.responseText.split("\n")[0]).get().then(function (querySnapshot) {


        querySnapshot.forEach(function (doc) {
       //   console.log(doc.id, '=>', doc.data());

          // Create a token that would have otherwise been created logging in normally.
          admin
            .auth()
            .createCustomToken(doc.id)
            .then((customToken) => {
              // Send user to connection page with token and ID for client to authenticate with.
              response2.redirect("/con?ct=" + customToken + "&uid=" + doc.id);
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



/*
===========================
  CHALLENGE RELATED PAGES
===========================
*/

// Challenge Page
// Grabs ID from request, asks database for data associate with the challenge, and lastly renders it on webpage.
// This is rendered server-side for performance reasons.
router.get("/challenges/:id", async (request, response) => {
  console.log("hit")
  const res = await db.collection('challenges').doc(request.params.id).update({
    views: admin.firestore.FieldValue.increment(1),
  });

  const docRef3 = db.collection('challenges').doc(request.params.id);
  const doc3 = await docRef3.get();

  if (!doc3.data()) {
    response.status(400).send("Challenge does not exist or it may have been removed.");
  }

  // All new challenges will have a challenge_author defined. This purely exists for legacy challenges.
  if (doc3.data().challenge_author) {
    author = doc3.data().challenge_author
  } else {
    author = "Unknown"
  }

  // What I'm doing here may seem stupid at first, 
  // but when directly referencing doc3.data(), if a certain rank like leaderboards_silver does not exist it causes a crash.

  var data = {
    "gold": "-",
    "bronze": "-",
    "silver": "-"
  }
  var category = "";
  if (doc3.data().leaderboards_gold) data.gold = doc3.data().leaderboards_gold;
  if (doc3.data().leaderboards_bronze) data.bronze = doc3.data().leaderboards_bronze;
  if (doc3.data().leaderboards_silver) data.silver = doc3.data().leaderboards_silver;

  return response.status(200).render(__dirname + "/views/dynamic/site/challenge-template.ejs", {
    CHALLENGE_NAME: doc3.data().title,
    CHALLENGE_DESCRIPTION: doc3.data().problem,
    CHALLENGE_AUTHOR: author,
    GOLD: data.gold,
    SILVER: data.silver,
    BRONZE: data.bronze
  });


});


// Edit Challenge Page
// Some data rendered serverside for performance reasons.
router.get("/challenges/:id/edit", async (request, response) => {

  const docRef3 = db.collection('challenges').doc(request.params.id);
  const doc3 = await docRef3.get();

  if (!doc3.data()) {
    response.status(400).send("Challenge does not exist or it may have been removed.");
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

  response.status(200).render(__dirname + "/views/dynamic/site/edit-challenge.ejs", {
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




/*

DEPRECATED: This was used for an early version of CTFLive. 

router.get("/game", (request, response) => {
  response.status(200).status(200).sendFile(__dirname + "/views/game.html");
});

*/



// Dashboard Page
router.get("/dashboard", (request, response) => {

  response.status(200).status(200).render(__dirname + "/views/dynamic/site/dashboard.ejs", {

  });
});

////////////////////////////////////////////////////////
module.exports = router;
