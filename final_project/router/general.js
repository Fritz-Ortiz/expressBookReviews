const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send({ message: "Username already exists" });
    }
    users.push({ username, password });
    res.status(200).send({ message: "User registered successfully" });
});

public_users.post("customer/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});


// Get the book list available in the shop
public_users.get("/",(req,res)=>{
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (book.author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(book);
      }
    }
  }

  res.json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = [];
  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book= books[key];
      if (book.title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(book);
      }
    }
  }

  res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const matchingBooks = [];
  
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.hasOwnProperty("reviews")) {
        matchingBooks.push(book.reviews);
      }
    }
  
    res.send(matchingBooks);
  });






module.exports.general = public_users;
