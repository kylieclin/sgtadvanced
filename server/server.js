
const express = require('express'); //load the express library into the file
const server = express();

server.use( express.static(__dirname + '/html') );

let insults = ['hi', 'hello', 'ya'];
    //the url path to listen for
    //the callback function to call once that path has been received
server.get('/', (req,res) =>{
    //an objext representing all the data coming from the client to the server
    //an object representing all the data going from the server to the client
    res.send('Hello, World.');
})

server.get('/time', (req, res)=>{
    let now = new Date();
    res.send(now.toLocaleDateString());
})

server.get('/insult', (req, res) =>{
    let index = Math.floor(Math.random()*insults.length);
    res.send(insults[index]);
})

server.listen(3001, ()=>{
    console.log('server is running on port 3001');
})