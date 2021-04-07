// Dependencies
// =============================================================
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
let dbJSON = require("./db/db.json");
const path = require("path");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



// Routes
// =============================================================


// API for notes

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {

    res.sendFile(path.join(__dirname, "/public/notes.html"));

});

app.get("/api/notes", function (req, res) {
    res.json(dbJSON);
});



app.post("/api/notes", function (req, res) {
    if (!req.body.title) {
        return res.json({ error: "Missing required title" });
    }

    const note = { ...req.body, id: uuidv4() }

    dbJSON.push(note);


    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(dbJSON), (err) => {
        if (err) {
            return res.json({ error: "Error writing to file" });
        }

        return res.json(note);
    });
});


// deleting note 

app.delete("/api/notes/:id", function (req, res) {

    dbJSON = dbJSON.filter(note => {
        return note.id !== req.params.id
    })

// saving note
    fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(dbJSON), (err) => {
        if (err) {
            return res.json({ error: "Error writing to file" });
        }
        return res.send();
    })

});



app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});




// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});