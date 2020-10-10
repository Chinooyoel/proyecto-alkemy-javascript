const express = require("express");
const app = express();
const connection = require("../mysql/mysql");

app.get("/", ( req, res ) => {

    res.redirect("/index.html");
})

app.get("/list-operations", ( req, res ) => {
    //we look for all operations in the database
    let sql = `SELECT o.id, o.concept, o.amount, o.date_operation, t.description type_operation FROM operation o INNER JOIN type_operation t ON t.id = o.type_operation_id ORDER BY o.id;`
    connection.query( sql, ( error, results ) => {
        if( error ){
            return res.status(500).json({
                error
            })
        }
        return res.json({
            operations: results
        })
    })
})

app.get("/operation/:id", ( req, res ) => {
    const id = req.params.id;

    //we look for the id the operation in the database
    let sql = "SELECT * FROM operation WHERE id = ?;"
    connection.query( sql, [id], ( error, results ) => {
        if( error ){
            return res.status(500).json({
                error
            })
        }

        //if the operation does not exist
        if ( results[0] == undefined ){
            return res.status(400).json({
                message: "there is no operation with that id"
            })
        }

        res.json({
            operation: results[0]
        })
        
    })
})

app.post("/register-operation", ( req, res ) => {
    //we received the operation
    let operation = req.body;
    
    //we insert the operation in the database
    let sql = ` INSERT operation ( concept, amount, date_operation, type_operation_id ) VALUES (?, ? , ?, ?);`;
    let values = [`${operation.concept}`, `${operation.amount}`, `${operation.date_operation}`, `${operation.type_operation_id}`];

    connection.query( sql, values, ( error, result  ) => {
        if( error ){
            return res.status(500).json({
                error
            })
        }
        res.redirect("/");
    })

})

app.post("/update-operation/:id", ( req, res ) => {
    const id = req.params.id;
    const operation_to_update = req.body;
    console.log(req.body, id)

    //we update the operation in the database
    let sql = "UPDATE operation SET concept = ?, amount = ?, date_operation = ? WHERE id = ?;"
    let values = [`${operation_to_update.concept}`, `${operation_to_update.amount}`, `${operation_to_update.date_operation}`, `${id}`];

    connection.query( sql, values, ( error, results ) => {
        if( error ){
            return res.status(500).json({
                error
            })
        }

        if( results.affectedRows === 0 ){
            return res.status(400).json({
                message: "there is no operation with that id"
            })
        }

        res.redirect("/");
    })
})


app.post("/delete-operation/:id", ( req, res ) => {
    const id = req.params.id;

    //we delete the operation in the database
    let sql = "DELETE FROM operation WHERE id = ?;";
    connection.query( sql, [id], ( error, result ) => {
        if( error ){
            return res.status(500).json({
                error
            })
        }

        if( result.affectedRows === 0 ){
            return res.status(400).json({
                message: "there is no operation with that id"
            })
        }
        
        res.json({
            ok:true
        });
    })
})

module.exports = app;