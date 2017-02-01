"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var assert = require("assert");
var books = require("google-books-search");
var MongoClient = require("mongodb").MongoClient;
app.use(bodyParser.json());
app.use(express.static("."));
var r = [];
var username;
var password;
var user;
var pwd;
var URL = "mongodb://127.0.0.1:27017/data5";
var URL1 = "mongodb://localhost:27017/mydatabase";

//Adds book tittle to bookshelf array in user details once user adds book to his bookshelf and entire book details along with username in bookshelf collection
app.post("/update_bookshelf/:username", function(req, res) {
    console.log("update bookshelf");
    MongoClient.connect(URL, function(err, db) {
        var userinfo = req.params.username;
        console.log("username:" + userinfo);
        var booktitle = req.body.title;
        console.log("book:" + booktitle);
        console.log("book");
        books.search(booktitle, function(error, results) {
            if (!error) {
                var booklist = [];
                results.forEach(function(element) {
                    booklist.push(element);
                }, this);

                if (err){ return;}
                var collection = db.collection("bookshelf11");
                var l = {
                    "username": userinfo
                };
                booklist[0].l = {
                    "username": userinfo
                };
                console.log(booklist[0]);
                collection.insert(booklist[0], function() {});
            } else {
                console.log(error);
            }
        });
        console.log("We are connected");
        var collection = db.collection("Signup");
        collection.update({
            username: userinfo
        }, {
            $push: {
                bookshelf: booktitle
            }
        }, false, true);
        res.send(JSON.stringify({
            "Attempt": "success"
        }));
    });
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/" + "home.html");
});

//getting all registered user details for follow using Signup collection
app.get("/allusers", function(req, res) {
    MongoClient.connect(URL, function(err, db) {
        console.log("We are connected");
        var collection = db.collection("Signup");
        collection.find({}).toArray(function(err, result) {
            if (!err) {
                res.send(JSON.stringify(result));
            }
        });

    });

});

//Adds username to follow array in user details once user had decided to follow another user in Signup Collection
app.post("/follow/:username", function(req, res) {
    var userinfo = req.params.username;
    console.log("username:" + userinfo);
    var followuser = req.body.follow;
    console.log(followuser);
    MongoClient.connect(URL, function(err, db) {
        console.log("We are connected");
        var collection = db.collection("Signup");
        collection.update({
            username: userinfo
        }, {
            $push: {
                follow: followuser
            }
        }, false, true);
        res.send(JSON.stringify({
            "Attempt": "success"
        }));
    });
});

//retrieves only those books from bookshelf collection based on users books in bookshelf using bookshelf11 collection
app.post("/favbookuser/:username", function(req, res) {
    var userinfo = req.params.username;
    console.log("username:" + userinfo);
    MongoClient.connect(URL, function(err, db) {
        console.log("We are connected fav books");
        var collection = db.collection("bookshelf11");
        collection.find({
            l: {
                username: userinfo
            }
        }).toArray(function(err, docs) {
            console.log(docs.length);
            var m;
            if (console.length === 0) {
                m = "failure";
            } else {
                m = docs;
            }
            res.send(JSON.stringify({
                "Attempt": m
            }));
        });
    });
});

// search book using google books api and insert it into book collection
app.post("/books", function(req, res) {
    var bookname = req.body.bookname;
    console.log(bookname);
    books.search(bookname, function(error, results) {
        if (!error) {
            console.log(results);
            var booklist = results;
            MongoClient.connect(URL1, function(err, db) {
                if (err) {return;}
                var collection = db.collection("books");
                collection.insert(booklist, function(err) {
                    if (!err) {
                        collection.find({}).toArray(function(err, docs) {
                            console.log(docs);
                            res.json(results);
                        });
                    } else {
                        console.log(err);
                    }
                });
            });
        } else {
            console.log(error);
        }
    });
});

//creates new user with unique username and save details in Signup collection
MongoClient.connect(URL, function(err, db) {
    app.post("/Signup", function(req, response) {
        username = req.body.username;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        password = req.body.password;
        var email = req.body.email;
        console.log(username + password + firstname + lastname + email);
        var user = [{
            "username": username,
            "password": password,
            "email": email,
            "firstname": firstname,
            "lastname": lastname,
            "aboutme": " ",
            "favourite": " ",
            "bookshelf": [],
            "follow": []
        }];
        var attempt;
        var collection = db.collection("Signup");
        register(db, function() {
            if (r.length === 0) {
                console.log("DOES not Exist:" + r.length);
                collection.insert(user, function() {
                    collection.find().toArray(function(err, docs) {console.log(docs);});
                });
                attempt = "success";
            } else {
                attempt = "failure";
                console.log("Exist:" + r.length);
            }
            r = [];
            response.send(JSON.stringify({
                "Attempt": attempt
            }));
        });
    });

    // register function to check if username exist already in Signup collection
    var register = function(db, callback) {
        var cursor = db.collection("Signup").find();
        cursor.each(function(err, doc) {
            assert.equal(err, null);
            if (doc !== null) {
                if (doc.username === username) {
                    r.push(doc);
                }
            } else {
                callback();
            }
        });
    };
});

//login function to check if user exist with particular username and password
app.post("/login", function(req, res) {
    MongoClient.connect(URL, function(err, db) {
        console.log("We are connected");
        var collection = db.collection("Signup");
        user = req.body.username;
        pwd = req.body.password;
        var attempt;
        collection.findOne({
            username: user,
            password: pwd
        }, function(err, document) {
            if (document !== null) {
                attempt = "";
                console.log("success");
                attempt = "success";
            } else {
                attempt = "";
                console.log("failure");
                attempt = "failure";
            }
            res.send(JSON.stringify({
                "Attempt": attempt
            }));
        });
    });
});

//Gets all user details from Signup collection based on username 
app.get("/userinfo/:userinfo", function(req, res) {
    MongoClient.connect(URL, function() {
        var userinfo = req.params.userinfo;
        console.log("username:" + userinfo);
        console.log(userinfo);
        MongoClient.connect(URL, function(err, db) {
            console.log("We are connected");
            var collection = db.collection("Signup");
            collection.findOne({
                username: userinfo,
            }, function(err, document) {
                console.log("document" + document);
                res.send(JSON.stringify({
                    "Attempt": document
                }));
            });
        });
    });
});

//Updates user information in Signup collection based on username
app.post("/update/:username", function(req, res) {
    MongoClient.connect(URL, function() {
        var userinfo = req.params.username;
        console.log("username:" + userinfo);
        var first = req.body.firstname;
        var last = req.body.lastname;
        var about = req.body.aboutme;
        var favourite = req.body.favourite;
        console.log("details" + first + last + about + favourite);
        MongoClient.connect(URL, function(err, db) {
            console.log(db +"We are connected");
            var collection = db.collection("Signup");
            collection.update({
                username: userinfo
            }, {
                $set: {
                    firstname: first,
                    lastname: last,
                    aboutme: about,
                    favourite: favourite
                }
            }, false, true);
            res.send(JSON.stringify({
                "Attempt": "success"
            }));
        });
    });
});

app.listen(3000);
