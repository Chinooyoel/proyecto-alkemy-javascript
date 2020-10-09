const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const connection = require("./mysql/mysql");

//we specify the public directory where 
//the static files are
app.use(express.static('public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//routes
app.use(require("./routes/index"));

//we connect the database
connection.connect(( error ) => {
    if( error) {
        console.log("Error: ", error);
        return;
    }
    
    console.log("Database online!!")
});

//we connect the server on port 8080
app.listen( port, ( error ) => {
    if( error ){
        console.log("Error: ", error);
        return;
    }

    console.log("Server online!!")
})
