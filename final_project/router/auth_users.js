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
    const review = req.query.review;

    // Get the username from the session
    const username = req.session.authorization?.username;

    // Check if user is logged in
    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Check if the ISBN exists in the books object
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if review is provided in the query
    if (!review) {
        return res.status(400).json({ message: 'Review text is missing' });
    }

    // If the reviews object does not exist for the book, create it
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify the review for the current user
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: 'Review successfully added or modified',
        reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Get the username from the session
    const username = req.session.authorization?.username;

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Check if the book exists by ISBN
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the review exists for the user
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: 'Review not found for this user' });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: 'Review successfully deleted',
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.users = users;
