// Copyright Pranav Ramesh 2021

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const admin = require('firebase-admin');
const serviceAccount = require('./secure/cyberjags-8b081-116221a4ed05.json');
var bodyParser = require('body-parser')

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}




admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}); 
//const HData = require('./database/hdata.js').HData;
//const conn = new HData();
//const sessionKey = require("./functions/session-key-gen.js");
const db = admin.firestore();
function updateLog(activity) {
  fs.readFile('logs.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    fs.writeFile("logs.txt", data + "\n" + activity, function (err) {
      if (err) return console.log(err);
    });
    
  });
      
}
const bcrypt = require('bcrypt');

const express = require("express");
const app = express();
const fs = require("fs");
let ejs = require('ejs');
const fetch = require('node-fetch');
var http = require("http").createServer(app);
const io = require("socket.io")(http);


var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static("public"));



io.on("connection", socket => {

  socket.on("connected", async player => {

    
    const docRef = db.collection('users').doc(player.userID);
    const doc = await docRef.get();
    if (!doc.exists) {  
      console.log('No such document!');
    } else {
  
      const localDoc = db.collection('ctflive').doc(player.userID);

      const unionRes = await localDoc.update({
        participants: admin.firestore.FieldValue.arrayUnion(player.userID)
      });
  
    }




    io.emit("connected", player);
  });

  socket.on("gamestart", info => {
    io.emit("gamestart", info);
  });




});




app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.get("/con", (request, response) => {
  response.sendFile(__dirname + "/views/con.html");
});


app.get("/api/duels/", (request, response) => {
  response.send("yes")
});


app.get("/link-account", (request, response) => {
  response.sendFile(__dirname + "/views/link-account.html");
});


app.get("/auth/stibarc",  (request, response2) => {



  var sessid = request.query.sess;
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
console.log(xhttp.responseText.toString().length)
var string2 = "pranav";
console.log(string2.length)
console.log(xhttp.responseText.split("\n")[0] == "pranav")
db.collection('users').where('stibarc_username', '==', xhttp.responseText.split("\n")[0]).get().then(function(querySnapshot) {


    querySnapshot.forEach(function(doc) {
       console.log(doc.id, '=>', doc.data());
       admin
  .auth()
  .createCustomToken(doc.id)
  .then((customToken) => {
    response2.redirect("https://ctfguide.tech/con?ct=" + customToken + "&uid=" + doc.id)
    })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });
      
    });


});






      }
  };
  xhttp.open("GET",  `https://api.stibarc.com/getusername.sjs?sess=${sessid}` , true);
  xhttp.send()
  
  });
  
  


app.get("/api/link-account", (request, response) => {

  db.collection('users').doc(request.query.uid).update({
    stibarc_username: request.query.stibarc
  })


  response.send("okay");

});



app.get("/api/game/:code/connect", (request, response) => {
  if (!request.params.code) return response.send("failure");
  
});
app.get("/settings", (request, response) => {
  response.sendFile(__dirname + "/views/settings.html");
});
app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/password-reset", (request, response) => {
  response.sendFile(__dirname + "/views/password-reset.html");
});
app.get("/challenges", (request, response) => {
  response.sendFile(__dirname + "/views/challenges.html");
});

app.get("/privacy", (request, response) => {
  response.sendFile(__dirname + "/views/privacy.html");
});

app.get("/tos", (request, response) => {
  response.sendFile(__dirname + "/views/tos.html");
});

app.get("/create-game", async (request, response) => {


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
          participants: {
          },
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

app.get("/:gamecode/game", async (request, response) => {
  var gamecode = request.params.gamecode;

  const docRef3 = db.collection('ctflive').doc(gamecode);
  const doc3 = await docRef3.get();

  response.render(__dirname + "/views/ctflive-game.ejs", {
    creator : doc3.data().creator
  });

});






app.post("/api/deletechallenge", urlencodedParser, async (request, response) => {
  const docRef = db.collection('users').doc(request.body.uid);
  const doc = await docRef.get();
  if (!doc.exists) {  
    console.log('No such document!');
  } else {

    if (doc.data().challenges.includes(request.body.id)) {

  const res = await db.collection("challenges").doc(request.body.id).delete();
    }
  }

});
app.post("/api/editchallenge", urlencodedParser, async (request, response) => {
  console.log(request.body)
  const docRef = db.collection('users').doc(request.body.uid);
  const doc = await docRef.get();
  if (!doc.exists) {  
    console.log('No such document!');
  } else {

    if (doc.data().challenges.includes(request.body.id)) {

    if (request.body.difficulty == "Do not change") {
      db.collection("challenges").doc(request.body.id).update({
        category: request.body.category,
        problem: request.body.problem,
        title: request.body.title
      }) 
    }  else {
    db.collection("challenges").doc(request.body.id).update({
      category: request.body.category,
      problem: request.body.problem,
      difficulty: (request.body.difficulty).toLowerCase(),
      title: request.body.title
    })
  }
if (request.body.solution) {
  bcrypt.hash(request.body.solution, 10).then(function(hash) {
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

app.post("/api/createchallenge", urlencodedParser, (request, response) => {
  return response.send("brb")
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
  
  bcrypt.hash(request.body.solution, 10).then(function(hash) {
    db.collection('solutions').doc(docRef.id).set({
      solution: hash
  })
  })
  
});
});

app.get("/challenges/:id", async (request, response) => {
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
  "gold" : "-",
  "bronze": "-",
  "silver": "-"
}
var category = "";
if (doc3.data().leaderboards_gold) data.gold = doc3.data().leaderboards_gold;
if (doc3.data().leaderboards_bronze) data.bronze = doc3.data().leaderboards_bronze;
if (doc3.data().leaderboards_silver) data.silver = doc3.data().leaderboards_silver;

  response.render(__dirname + "/views/challenge-template.ejs", {
    CHALLENGE_NAME : doc3.data().title,
    CHALLENGE_DESCRIPTION: doc3.data().problem,
    CHALLENGE_AUTHOR: author,
    GOLD: data.gold,
    SILVER: data.silver,
    BRONZE:  data.bronze
  });

  return;
});



app.get("/challenges/:id/edit", async (request, response) => {

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
  "gold" : "-",
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
var v =  doc3.data().views;
var g = doc3.data().gattempts;
var a = doc3.data().attempts;
if (!v) v = 0;
if (!g) g = 0;
if (!a) a = 0;

  response.render(__dirname + "/views/edit-challenge.ejs", {
    CHALLENGE_NAME : doc3.data().title,
    CHALLENGE_DESCRIPTION: doc3.data().problem,
    CHALLENGE_AUTHOR: author,
    CHALLENGE_DIFFICULTY: doc3.data().difficulty.toLowerCase(), 
    GOLD: data.gold,
    SILVER: data.silver,
    BRONZE:  data.bronze,
    CHALLENGE_ID: request.params.id,
    CHALLENGE_CATEGORY: category,
    VIEWS: v,
    GATTEMPTS: g,
    ATTEMPTS: a
  });
});





app.get("/register", (request, response) => {
  response.sendFile(__dirname + "/views/register.html");
});

app.get("/game", (request, response) => {
  response.sendFile(__dirname + "/views/game.html");
});

app.get("/dashboard", (request, response) => {
  response.sendFile(__dirname + "/views/dashboard.html");

});

/*

    app.get("/api/v2/auth-user", (request, response) => {
    
      conn.getKey("users", request.query.email, function(res,err) {
        if (!err) {
            console.log(res);
            bcrypt.compare(request.query.password, 10).then(function(hash) {
              var freshSessId = [];
              freshSessId.push(sessionKey(5));
              conn.setKey("users", request.query.email, {
                "password":hash,
                "newuser":true,
                "confirmed":false,
                "sessid": freshSessId
              }, function(res,err) {
                if (!err) {
                    console.log(res)
                    return response.send(freshSessId[0]);
                } else {
                    console.log(err)
                    return response.send("Error")
                }
              });
          });
          






        } else {
            console.log(err);
        }
      });

    });


    app.get("/api/v2/create-user", (request, response) => {
      conn.createTable("users", function(res, err) {
        if (!err) {
            if (res.status == "OK") {
                console.log("Table created!");
            } else {
                console.log(JSON.stringify(res));
            }
        } else {
            console.log(err);
        }
      });

      bcrypt.hash(request.query.password, 10).then(function(hash) {
        var freshSessId = [];
        freshSessId.push(sessionKey(5));
        conn.setKey("users", request.query.email, {
          "password":hash,
          "newuser":true,
          "confirmed":false,
          "sessid": freshSessId
        }, function(res,err) {
          if (!err) {
              console.log(res)
              return response.send("ok")
          } else {
              console.log(err);
              return response.send("Error")
          }
        });
    });

    });

*/



app.get("/api/setusername", (request, response) => {
  db.collection('users').doc(request.query.uid).update({
    username: request.query.username
  })
  response.send("okay")
});
app.get("/ctflive/join", (request, response) => {
  response.sendFile(__dirname + "/views/ctflive.html");

});

app.get("/ctflive/:gamecode/client", (request, response) => {
  response.render(__dirname + "/views/ctflive-client.ejs", {
      CODE: request.params.gamecode
  }); 

});

app.get("/api/inituser", (request, response) => {
 db.collection('users').doc(request.query.id).set({
      points: "0",
      victories: "0",
      rank: "Unrated"
  })
  response.send("ok")
})

app.get("/api/checksolution", async (request, response) => {
  const docRef = db.collection('solutions').doc(request.query.id);
  const doc = await docRef.get();

  const res = await db.collection('challenges').doc(request.query.id).update({
    attempts: admin.firestore.FieldValue.increment(1),
  });


  if (!doc.exists) {  
    console.log('No such document!');
  } else {
    bcrypt.compare(request.query.solution, doc.data().solution).then(async function(result) {
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
      
          request1.setRequestHeader('Content-type', 'application/json');
      
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


app.get("/:code/game/lobby", (request, response) => {
  fs.readFile('rooms.json', 'utf8', function (err,data) {
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


http.listen(88, () => {
  console.log("ctfguide");
});
