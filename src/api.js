////////////////// VARIABLES ////////////////////////////
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bodyParser = require('body-parser')
const fs = require("fs");
let ejs = require('ejs');
const bcrypt = require('bcrypt');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
  
////////////////////////////////////////////////////////


// Link STiBaRC accounts to CTFGuide
router.get("/link-account", (request, response) => {
    db.collection('users').doc(request.query.uid).update({
      stibarc_username: request.query.stibarc
    });
    return response.send("okay");
});

// Delete CTFGuide Challenges
router.post("/deletechallenge", urlencodedParser, async (request, response) => {
    const docRef = db.collection('users').doc(request.body.uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      // Checking if this user actually owns that challenge.
      if (doc.data().challenges.includes(request.body.id)) {
        const res = await db.collection("challenges").doc(request.body.id).delete();
      }
    }
  
  });



// Edit CTFGuide Challenges
router.post("/editchallenge", urlencodedParser, async (request, response) => {
  console.log(request.body)
  const docRef = db.collection('users').doc(request.body.uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    // Checking if this user actually owns that challenge.
    if (doc.data().challenges.includes(request.body.id)) {

      if (request.body.difficulty == "Do not change") {
        db.collection("challenges").doc(request.body.id).update({
          category: request.body.category,
          problem: request.body.problem,
          title: request.body.title

        })
      } else {
        db.collection("challenges").doc(request.body.id).update({
          category: request.body.category,
          problem: request.body.problem,
          difficulty: (request.body.difficulty).toLowerCase(),
          title: request.body.title
        })
      }
      if (request.body.solution) {
          // Solution Confidentiality being implemented here.
        bcrypt.hash(request.body.solution, 10).then(function (hash) {
          db.collection('solutions').doc(request.body.id).set({
            solution: hash
          })
        })
      }

    } else {
      return response.send("unauthorized")
    }

  }

});


// Create a challenge
router.post("/createchallenge", urlencodedParser, (request, response) => {
    if (!request.body.challenge_author) return response.send("bad")
    db.collection("challenges").add({
      category: request.body.category,
      difficulty: request.body.difficulty,
      title: request.body.title,
      problem: request.body.problem,
      challenge_author: request.body.challenge_author
    }).then((docRef) => {
  
      updateLog(`[TIME: ${Date.now()}] [ID: ${request.query.id}] A new problem was uploaded to the CTFGuide Platform. `)
  
      console.log(docRef.id)
      db.collection('users').doc(request.body.uid).update({
        challenges: admin.firestore.FieldValue.arrayUnion(docRef.id)
      })

    // Solution Confidentiality being implemented here.
      bcrypt.hash(request.body.solution, 10).then(function (hash) {
        db.collection('solutions').doc(docRef.id).set({
          solution: hash
        })
      })
  
    });
  });

// Set user's username (This would be done via intial setup or settings page.)
router.get("/setusername", (request, response) => {
  db.collection('users').doc(request.query.uid).update({
    username: request.query.username
  })
  response.send("okay")
});


// Intialize a new user in our database.
router.get("/inituser", (request, response) => {
    db.collection('users').doc(request.query.id).set({
      points: "0",
      victories: "0",
      rank: "Unrated"
    })
    response.send("ok")
});

// Verify solutions for challenges.
router.get("/checksolution", async (request, response) => {
    const docRef = db.collection('solutions').doc(request.query.id);
    const doc = await docRef.get();
  
    const res = await db.collection('challenges').doc(request.query.id).update({
      attempts: admin.firestore.FieldValue.increment(1),
    });
  
  
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      bcrypt.compare(request.query.solution, doc.data().solution).then(async function (result) {
        if (result == true) {
  
          const docRef2 = db.collection('users').doc(request.query.uid);
          const doc2 = await docRef2.get();
  
  
          if (doc2.data().solved && doc2.data().solved.includes(request.query.id)) {
            return response.send("good")
          }
  
  
  
          db.collection('users').doc(request.query.uid).update({
            points: admin.firestore.FieldValue.increment(50),
            solved: admin.firestore.FieldValue.arrayUnion(request.query.id)
          });
          const res = await db.collection('challenges').doc(request.query.id).update({
            gattempts: admin.firestore.FieldValue.increment(1),
          });
  
  
          const docRef3 = db.collection('challenges').doc(request.query.id);
          const doc3 = await docRef3.get();
  
          if (!doc3.data().leaderboards_gold) {
            const res = await db.collection('challenges').doc(request.query.id).update({
              leaderboards_gold: request.query.username
            });
          } else if (!doc3.data().leaderboards_silver) {
  
            const res = await db.collection('challenges').doc(request.query.id).update({
              leaderboards_silver: request.query.username
            });
          } else if (!doc3.data().leaderboards_bronze) {
            const res = await db.collection('challenges').doc(request.query.id).update({
              leaderboards_bronze: request.query.username
            });
          } else {
            //
          }
  
  
  
          var points = doc2.data().points
          // RANK MANAGER
          if (points < 200) {
            const res = await db.collection('users').doc(request.query.uid).update({
              rank: "Unrated"
            });
          }
  
          if (points > 200 && points < 600) {
            const res = await db.collection('users').doc(request.query.uid).update({
              rank: "Bronze"
            });
          }
  
  
          if (points > 600 && points < 1200) {
            const res = await db.collection('users').doc(request.query.uid).update({
              rank: "Silver"
            });
          }
  
          if (points > 1200) {
            const res = await db.collection('users').doc(request.query.uid).update({
              rank: "Gold"
            });
          }
          var request1 = new XMLHttpRequest();
          request1.open("POST", "https://discord.com/api/webhooks/774735758182449193/hHJqdokRkUTWeqJHaAeoJQ3Ztu68rIH8JPGNCpyBDxmKz7S_eb43bv0SeL60gQHIe6tT");
  
          request1.setRequestHeader('Content-type', 'routerlication/json');
  
          var params = {
            username: `${request.query.username} completed a challenge!`,
            content: "GG!"
          }
  
          request1.send(JSON.stringify(params));
  
  
          updateLog(`[TIME: ${Date.now()}] [PID: ${request.query.id}] [UID: ${request.query.uid}] A problem was solved on the CTFGuide Platform.`)
          return response.send("good");
        } else {
          return response.send("bad");
        }
      });
  
    }
  
  
  })









////////////////////////////////////////////////////////
module.exports = router;
