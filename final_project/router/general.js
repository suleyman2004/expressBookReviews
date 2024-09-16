const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require("body-parser");

public_users.use(bodyParser.json());
public_users.use(bodyParser.urlencoded({
    extended: true
}))


public_users.post("/register", (req, res) => {
    //Write your code here
    // Check if a user with the given username already exists
    const doesExist = (username) => {
        // Filter the users array for any user with the same username
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        // Return true if any user with the same username is found, otherwise false
        if (userswithsamename.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://dhannyyewhan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ais/');
        res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book list', error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`https://dhannyyewhan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ais/isbn/${isbn}`);
        const isbn = req.params.isbn;
        if (books[isbn]) {
            res.status(200).send(books[isbn]);
        } else {
            return res.status(404).send(`Unable to find book number ${isbn}`)
        }
    } catch (error) {
        res.status(404).send(`Unable to find website`);
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`https://dhannyyewhan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ais/author/${author}`);
        const author = req.params.author;
        const filteredAuthors = Object.values(books).filter(book => book.author === author);
        if (filteredAutorss > 0) {
            res.send(filteredAuthors);
        } else {
            res.status(404).send("No books found by this author");
        }
    } catch (error) {
        res.status(404).send(`Unable to find website`);
    }
});



// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`https://dhannyyewhan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ais/title/${title}`);
        const title = req.params.title.toLowerCase();
        const findTitle = Object.values(books).find(book => book.title.toLowerCase() === title);
        if (findTitle) {
            res.send(findTitle);
        } else {
            res.status(404).send("No books found by this title");
        }
    } catch (error) {
        res.status(404).send(`Unable to find website`);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const review_isbn = req.params.isbn
    if (review_isbn) {
        res.send(books[review_isbn].reviews)
    } else {
        res.send("No reviev found by this book number " + review_isbn)
    }
});

module.exports.general = public_users;
