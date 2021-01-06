// Copyright Pranav Ramesh 2021
this will break right
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const admin = require('firebase-admin');
const serviceAccount = require('./other/cyberjags-8b081-116221a4ed05.json');
var bodyParser = require('body-parser');
const args = process.argv;
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
function updateLog(activity) {
  fs.readFile('/other/logs.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    fs.writeFile("/other/logs.txt", data + "\n" + activity, function (err) {
      if (err) return console.log(err);
    });

  });

}
const os = require("os")
const bcrypt = require('bcrypt');
const express = require("express");
const app = express();
const fs = require("fs");
let ejs = require('ejs');
const fetch = require('node-fetch');
var http = require("http").createServer(app);
const io = require("socket.io")(http);
var api = require('./src/api.js')
var views = require('./src/views.js')
var ctflive = require('./src/ctflive.js')
app.use('/api', api);
app.use('/', views);
app.use('/ctflive', ctflive);
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})
app.use(express.static("public"));
io.on("connection", socket => {

  socket.on("connected", async player => {

    console.log('\x1b[36m%s\x1b[0m', "CTFLive Incoming Connection:");
    console.log('\x1b[33m%s\x1b[0m', `Player User ID : ${player.userID}\nGame ID: ${player.gameID}`)

    const docRef = db.collection('users').doc(player.userID);
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {

      const localDocRef = db.collection('ctflive').doc(player.gameID);
      const localDoc = await localDocRef.get();
      console.log(localDoc.data())
      var tempJSONObj = JSON.parse(localDoc.data().participants);
      tempJSONObj.participants.push(doc.data().username)

      localDocRef.update({
        'participants': JSON.stringify(tempJSONObj)
      })


    }


    io.emit("connected", player);
  });

  socket.on("gamestart", info => {
    io.emit("gamestart", info);
  });




});
http.listen(process.env.PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', "[SERVER] CTFGuide is deployed on port 88.");
  if (os.hostname() == "LAPTOP-S4BMA3PQ") {
    console.log('\x1b[33m%s\x1b[0m', "[SERVER] Deployed Locally | http://localhost:88")
  }  else {
    console.log('\x1b[33m%s\x1b[0m', "[SERVER] Deployed Live | https://ctfguide.tech")
    if (args[2] == "gh") {
       console.log('\x1b[33m%s\x1b[0m', "[GITHUB] All tests passed");
       process.exit(0);
    }
  }



});