const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const bodyParser = require('body-parser');
const regd_users = express.Router();
let users = [];

regd_users.use(bodyParser.json());
regd_users.use(bodyParser.urlencoded({
    extended: true
}))

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 360 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    let friend = friends[isbn];  // Retrieve friend object associated with email

    if (friend) {  // Check if friend exists
        let DOB = req.body.DOB;
        let firstName= req.body.firstName;
        let lastName=req.body.lastName;
        // Update DOB if provided in request body
        if (DOB) {
            friend["DOB"] = DOB;
        }
        if (firstName) {
            friend["firstName"] = firstName;
        }
        if (lastName) {
            friend["lastName"] = lastName;
        }

        friends[email] = friend;  // Update friend details in 'friends' object
        res.send(`Friend with the email ${email} updated.`);
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to find friend!");
    }
});
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
