
const express = require('express'); //load the express library into the file
const mysql = require('mysql'); //load mysql library
const mysqlcredientials = require('./mysqlcreds.js'); //load creds in other file./means current folder
//crediential create here will be different from the folder so we have to ignore it

const db = mysql.createConnection( mysqlcredientials );  //using the credentials that we loaded, establish a preliminary connection to the database

const server = express();

server.use( express.static(__dirname + '/html') ); //.use is  the middleware
//express.static To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
//In Node.js, __dirname is always the directory in which the currently executing script resides

server.use( express.urlencoded({ extended: false}) ); //have express pull body data that is urlencoded and place it into an obj called "body"   

//server.use( express.json()) //use for things like axios

//make an endpoint to handle retrieving the grades of all students           
server.get('/api/grades', (req,res) =>{ //api can name anything| when the server receive the request of the url call the function
    db.connect( ()=>{ //establish the connection to the database, and call the callback when the connecttion is made
        const query = 'SELECT `id`, CONCAT(`givenname`," ", `surname`) AS `name`, `course`, `grade` FROM `grades`'; //query of mysql

        //send the query to database and get callback function when data retrived
        db.query(query , (error, data )=>{
            const output = { //make output an obj looks same as the dummy data for send to client
                success: false,
            }
            if(!error){ // if no error, error will be null
                //notify client success
                output.success = true;
                //give the data to client
                output.data = data;
            } else {
                output.error = error;
            }
             res.send(output);              
        })
    });
});

//add student
server.post('/api/grades', (req, res)=>{

    // check body see if any data was not send
    if(req.body.name === undefined || req.body.course === undefined  || req.body.grade === undefined ){
        res.send({//if not send error message to client
            success: false,
            error: 'invalid name, course, or grade'
        });
        return; //quit server.post function
    }

    db.connect(()=>{ //connect to database
        const name = req.body.name.split(" "); //split surname and givenname into an array

        const query = 'INSERT INTO `grades` SET `surname` = "'+name.slice(1).join(' ')+'", `givenname`="'+name[0]+'", `course` = "'+req.body.course+'", `grade`='+req.body.grade+', `added`=NOW()'; //set my sql query

        db.query(query, (error, results)=>{

            if(!error){
                res.send({
                    success: true,
                    new_id: results.insertId //insertId get the data of the auto increemnt field
                })
            } else {
                res.send({
                    success: flase,
                    error 
                }) 
            }
        })
    })
})

//delete student
server.delete('/api/grades', (req, res)=>{ // '/api/grades/:student_id'
    // console.log(req.query);  
    //req.query is from the url params student_id=1 (in sgt delete : url: 'api/grades?student_id='+parseId)
    if(req.query.student_id === undefined){ //req.params.student_id
        res.send({
            success: false,
            error: 'must provide a student id for delete'
        })
        return;
    }
    db.connect(()=>{
        const query = 'DELETE FROM `grades` WHERE `id`='+ req.query.student_id;
        db.query(query, (error, results) => {
            if(!error){
              res.send({
                  success: true
              });  
            } else {
                res.send({
                    success: false,
                    error
                })
            }
        })
    })
    
})

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