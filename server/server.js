
const express = require('express'); //load the express library into the file
const mysql = require('mysql');
const mysqlcredientials = require('./mysqlcreds.js'); //put in other file ./means current folder
//crediential create here will be different from the folder so we have to ignore it

const db = mysql.createConnection( mysqlcredientials );

const server = express();

server.use( express.static(__dirname + '/html') );
//express.static To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
//In Node.js, __dirname is always the directory in which the currently executing script resides
          //api can name anything
server.get('/api/grades', (req,res) =>{
    res.send(`{
        "success": true,
        "data": [{
            "id": 10,
            "name": "Ya Yo",
            "course": "cook",
            "grade": 80
        }, {
            "id": 1,
            "name": "Ay Hui",
            "course": "Book",
            "grade": 56
        }, {
            "id": 2,
            "name": "Do Re",
            "course": "Music",
            "grade": 100
        }, {
            "id": 3,
            "name": "Mi Fa",
            "course": "yuk",
            "grade": 77
        }]
    }`)
});

server.listen(3001, ()=>{
    console.log('server is running on port 3001');
});



// server.get('/', (req,res) =>{
//     //an objext representing all the data coming from the client to the server
//     //an object representing all the data going from the server to the client
//     res.send('Hello, World.');
// })

// server.get('/time', (req, res)=>{
//     let now = new Date();
//     res.send(now.toLocaleDateString());
// })