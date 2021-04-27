////////////////// VARIABLES ////////////////////////////
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bodyParser = require('body-parser')
const fs = require("fs");
let ejs = require('ejs');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
////////////////////////////////////////////////////////



router.get("/create-game", async (request, response) => {


    var gamecode = makeid(7);
    var authorID = request.query.uid;
    var cid = request.query.cid;
  
  
    const docRef2 = db.collection('challenges').doc(cid);
    const doc2 = await docRef2.get();
  
    if (!doc2.exists) {
      console.log('No such document!');
      return response.send("error")
    } else {
      if (doc2.data().ctflive_enabled == true) {
  
        const docRef = db.collection('users').doc(authorID);
        const doc = await docRef.get();
        if (!doc.exists) {
          console.log('No such document!');
          return response.send("error")
        } else {
  
  
  
          db.collection('ctflive').doc(gamecode).set({
            code: gamecode,
            participants: `{"participants" : []}`,
            creator: doc.data().username,
            challengeid: cid,
            leaderboards: `{"leaderboard": {}}`,
            authorID: authorID
          })
  
          return response.send(gamecode);
  
        }
      } else {
        return response.send("error")
      }
    }
  
  
  });
  
  router.get("/:gamecode/game", async (request, response) => {
    var gamecode = request.params.gamecode;
  
    const docRef3 = db.collection('ctflive').doc(gamecode);
    const doc3 = await docRef3.get();
  
    response.status("200").render(__dirname + "/views/dynamic/ctflive/ctflive-game.ejs", {
      creator: doc3.data().creator
    });
  
  });
  
  
  router.get("/check/:gamecode", async (request, response) => {
    var gamecode = request.params.gamecode;
  
    const docRef3 = db.collection('ctflive').doc(gamecode);
    const doc3 = await docRef3.get();
    if (!doc3.exists) {
      response.status("200").send("Game not found.");
    } else {
      response.status("200").send(gamecode  )
    }
  });
  
  
  router.get("/initPlayer", async (request, response) => {
      // initialize player on leaderboard
      const docRef = db.collection('ctflive').doc(request.query.gameid);
      const doc = await docRef.get();
      var oldLB = doc.data().leaderboards;
      oldLB = JSON.parse(oldLB);
      
      var tempJSONObj = JSON.parse(doc.data().participants);

      // Get username from ID
      const docRef2 = db.collection('users').doc(request.query.userid);
      const doc2 = await docRef2.get();

      // Set their score to 0 on JSON object.
    //  console.log(doc2.data())
    //  console.log(doc2.data().username)
    if (!tempJSONObj.participants.includes(doc.data().username)) {
      oldLB.leaderboard[`${doc2.data().username}`] = 0
    }


      // Push JSON to database
      db.collection("ctflive").doc(request.query.gameid).update({
  
        "leaderboards" : JSON.stringify(oldLB)

      })

      console.log(request.query.userid)
      return response.send("OK");

  });
  router.get("/checkFlag", async (request, response) => {

    console.log("DEBUG:\n" + 
    `${request.query.userid}, ${request.query.gameid}, ${request.query.flag}, ${request.query.flagfor}`)
  
    // Get challenge id
    const docRef3 = db.collection('ctflive').doc(request.query.gameid);
    const doc3 = await docRef3.get();
    var challengeID = doc3.data().challengeid;

    // Get flag
    const docRef4 = db.collection('challenges').doc(challengeID);
    const doc4 = await docRef4.get();
    var correctFlag = "";
    var newPos = 0
    if (request.query.flagfor == "1") {
      correctFlag = doc4.data().ctf_flag1;
      newPos = 1;
    } else if (request.query.flagfor == "2") {
      correctFlag = doc4.data().ctf_flag2;
      newPos = 2;

    } else  {
      correctFlag = doc4.data().ctf_flag3;
      newPos = 3;

    }

    if (correctFlag == request.query.flag) {
      const docRef = db.collection('ctflive').doc(request.query.gameid);
      const doc = await docRef.get();
      var oldLB = doc.data().leaderboards;
      oldLB = JSON.parse(oldLB);
      const docRef2 = db.collection('users').doc(request.query.userid);

      const doc2 = await docRef2.get();
      oldLB.leaderboard[`${doc2.data().username}`] = newPos;

      // Set their score to 0 on JSON object.
    //  console.log(doc2.data())
    //  console.log(doc2.data().username)

  
      // Push JSON to database
      db.collection("ctflive").doc(request.query.gameid).update({
  
        "leaderboards" : JSON.stringify(oldLB)

      })

     return response.send("OK")
    } else {
      console.log("bad")
      return response.send("BAD")
    }
  })
  
  router.get("/config", async (request, response) => {
    console.log("hit!")
    var flags = {
      "flag1": request.query.flag1,
      "flag2": request.query.flag2,
      "flag3": request.query.flag3
    }

    console.log(flags)
  
    const docRef = db.collection('users').doc(request.query.uid);
    const doc = await docRef.get();
    if (!doc.exists) {
    //  console.log('No such document!');
    } else {
  
      if (doc.data().challenges.includes(request.query.id)) {
        // This is their challenge.
        db.collection("challenges").doc(request.query.id).update({
  
          "ctf_flag1": request.query.flag1,
          "ctf_flag2": request.query.flag2,
          "ctf_flag3": request.query.flag3,
          "ctflive_enabled": true
  
        })
      }
  
  
    }
  
    return response.status("200").send("okay")
  
  
  
  
  
  
  })
  
  
  
  
  
  router.get("/join", (request, response) => {
    response.status("200").sendFile(__dirname + "/views/static/site/ctflive.html");
  
  });
  
  router.get("/:gamecode/client", (request, response) => {
    response.status("200").render(__dirname + "/views/dynamic/ctflive/ctflive-client.ejs", {
      CODE: request.params.gamecode
    });
  
  });
  



////////////////////////////////////////////////////////
module.exports = router;
