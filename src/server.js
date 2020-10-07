const express = require("express");
const app = express();
const port = 8080;


app.get("/", ( req, res ) => {
    res.send("hola")
})


//we connect the server on port 8080
app.listen( port, ( error ) => {
    if( error ){
        console.log("Error: ", error);
        return;
    }

    console.log("Server online!!")
})
