// Modules needed
const express = require('express');
const fs = require('fs');
const uuid = require('uuid/v1');

//Paths
const path = require('path');
const datab = require('./db/db.json');
let dpath = path.join(__dirname, '/db/db.json');

//Assigned to operate on port 3001
var app = express();
var PORT = process.env.PORT || 3001;

//link to public folder 
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', function(req, res) {
    res.json(datab);
});

//Assigns ID using uuid module
app.post("/api/notes", function(req, res) {
  var uniqId = uuid();
  var newtask = req.body;
  newtask.id = uniqId;
  datab.push(newtask);
  fs.writeFileSync(dpath,JSON.stringify(datab),function(err,data){
    if (err) throw err;
  })
  res.json(newtask);
});

//Functionality for deleting notes
app.delete("/api/notes/:id" ,function(req,res){
  const dId = req.params.id;
  for (i=0;i<datab.length;i++){

    if(datab[i].id ===dId){
      datab.splice(i,1);
      break;
    } 
  }
  res.json(datab);
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});