// Copyright Pranav Ramesh 2021
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const admin = require('firebase-admin');
const serviceAccount = require('./other/cyberjags-8b081-c2e825de631b.json');
const secret  = require("./other/secret.json")
var bodyParser = require('body-parser');
const args = process.argv;
const { Webhook , MessageBuilder} = require('discord-webhook-node');
const hook = new Webhook(secret.webhook);

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
db.settings({ ignoreUndefinedProperties: true })
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

      if (!tempJSONObj.participants.includes(doc.data().username)) {
        tempJSONObj.participants.push(doc.data().username)
      }


      console.log(tempJSONObj)
      localDocRef.update({
        'participants': JSON.stringify(tempJSONObj)
      })


      io.emit("connected", {
        username: player.username,
        gameID: player.gameID,
        participants: JSON.stringify(tempJSONObj),
        userID: "removed"
      });

    }


  });

  socket.on("gamestart", async info => {

    const docRef2 = db.collection('ctflive').doc(info.gameID);
    const doc2 = await docRef2.get();

    if (!doc2.exists) {
      console.log('No such document!');
      return response.send("error")
    } else {

      // Fetch challenge details from db
      const docRef3 = db.collection('challenges').doc(doc2.data().challengeid);
      const doc3 = await docRef3.get();
      info.challenge = doc3.data().problem;
      info.participants = doc2.data().participants;
      console.log(info)

      io.emit("gamestart", info);

    }
  });


  socket.on("ssbroadcast", async info => {

    const docRef2 = db.collection('ctflive').doc(info.gameid);
    const doc2 = await docRef2.get();
    io.emit("sstransit", {

      leaderboards: doc2.data().leaderboards,
      participants: doc2.data().participants

    })

  });

});




http.listen(88, () => {
  console.log('\x1b[36m%s\x1b[0m', "[SERVER] CTFGuide is deployed on port 88.");
  if (os.hostname() == "laphvm") {
    console.log('\x1b[33m%s\x1b[0m', "[SERVER] Deployed Live | http://ctfguide.tech")
    hook.setUsername("CTFGuide (Main Server)");
    const embed = new MessageBuilder()
      .setTitle('Server restarted succesfully.')
      .setDescription('')
      .setColor('#00FF00')
      .setTimestamp();
    hook.send(embed);

  } else {
    console.log('\x1b[33m%s\x1b[0m', "[SERVER] Deployed Locally | http://localhost:88") 
    hook.setUsername("CTFGuide (Local Testing)");
    const embed = new MessageBuilder()
      .setTitle('Server restarted succesfully.')
      .setDescription('')
      .setColor('#00FF00')
      .setTimestamp();
    hook.send(embed);
  }



});
