const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
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
