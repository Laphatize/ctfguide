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
      if (doc2.data().ctflive_enabled == "true") {
  
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
            challengeid: cid
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
  
    response.render(__dirname + "/views/ctflive-game.ejs", {
      creator: doc3.data().creator
    });
  
  });
  
  
  
  
  
  router.get("/config", async (request, response) => {
  
    var flags = {
      "flag1": request.query.flag1,
      "flag2": request.query.flag2,
      "flag3": request.query.flag3
    }
  
    const docRef = db.collection('users').doc(request.query.uid);
    const doc = await docRef.get();
    if (!doc.exists) {
    //  console.log('No such document!');
    } else {
  
      if (doc.data().challenges.includes(request.query.id)) {
        // This is their challenge.
        db.collection("challenges").doc(request.query.id).update({
  
          "ctf_flag1": flags.flag1,
          "ctf_flag2": flags.flag2,
          "ctf_flag3": flags.flag3,
          "ctflive_enabled": request.query.cte
  
        })
      }
  
  
    }
  
    return response.send("okay")
  
  
  
  
  
  
  })
  
  
  
  
  
  router.get("/join", (request, response) => {
    response.sendFile(__dirname + "/views/ctflive.html");
  
  });
  
  router.get("/:gamecode/client", (request, response) => {
    response.render(__dirname + "/views/ctflive-client.ejs", {
      CODE: request.params.gamecode
    });
  
  });
  
  
  
  router.get("/:code/game/lobby", (request, response) => {
    fs.readFile('rooms.json', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var raw = JSON.parse(data);
      var temp = JSON.parse(data).rooms[`${request.params.code}`].players;
  
      console.log(temp)
      temp.push(request.query.email)
      raw.rooms[`${request.params.code}`].players = temp;
  
      console.log(raw)
      fs.writeFile("rooms.json", JSON.stringify(raw, null, 2), function (err) {
        if (err) return console.log(err);
        response.render(__dirname + "/views/game.ejs", {
          GAME: "test",
          CREATOR: JSON.parse(data).rooms[`${request.params.code}`].creator,
          CHALLENGE: JSON.parse(data).rooms[`${request.params.code}`].challenge
  
        });
      });
  
    });
  
  
  });
  



////////////////////////////////////////////////////////
module.exports = router;
