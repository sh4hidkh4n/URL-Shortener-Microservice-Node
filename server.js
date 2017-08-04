// server.js
// where your node app starts

// init project
var express = require('express');
const URL = require("url");
const lowDB = require("lowdb")
var app = express();
var hash = require("./hash")
const urlRegex = require('url-regex');

const db = lowDB(".data/urls.json", { storage: require('lowdb/lib/storages/file-async') })


const host = "https://tinylink.glitch.me/"

db.defaults(
    {
      counter: 10001,
      urls: [{
        "id": 10000,
        "url": "https://google.com",
        "hash": "3Yq"
      }]
    }
).write()


function getUrlID(){
  return db.get("counter").value();
}


app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



// add new url to the database
app.get("/url/*", function (request, response) {
  // console.log(re)
  const url = request.params[0]
  if(!urlRegex({exact: true, strict: false}).test(url)){
    response.json({"error" : "Invalid URL"})
    return;
  }
  var urlVal = db.get('urls')
    .find({ url: url })
    .value()
  if(urlVal){
    response.redirect(urlVal["url"])
  }else{
    var id = getUrlID()
    
    var urlHash = hash.encodeHash(id)
    
    var shortenedUrl = {
      id,
      url,
      hash : urlHash
    }
    db.get("urls").push(shortenedUrl).write()
    const counter = db.get("counter").value()
    db.set("counter", counter+1).write()
    response.json({"hash" : shortenedUrl.hash, "url" : shortenedUrl.url, "shortenLink" : host + shortenedUrl.hash})
  }
});

app.get("/:hash", function(req, res){
  const h = req.params.hash
  const urlData = db.get("urls")
                    .find({hash: h})
                    .value();
  console.log(urlData)
  if(urlData) res.redirect(urlData["url"]);
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
