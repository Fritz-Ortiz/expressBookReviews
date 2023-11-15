const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"Kyra","password":"boks"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const sameUser = users.filter((user) => user.username === username);

  if (sameUser.length > 0) {
    return false; // User found, username match
  } else {
    return true; // User not found or usernamed do not match
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const sameUser = users.filter((user) => user.username === username && user.password === password);

  if (sameUser.length > 0) {
    return true; // User found, username and password match
  } else {
    return false; // User not found or username and password do not match
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  console.log("login: ", req.body);
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
        req.session.save();
        return res.status(200).send(username +" successfully logged in" + "  --session name--"+req.session.authorization.username);
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
      const isbn = req.params.isbn;
      
      const review = req.body.review;
      
      const username = req.session.authorization.username;
      
      console.log("add review: ", req.params, req.body, req.session);
      if (books[isbn]) {
          let book = books[isbn];
          book.reviews[username] = review;
          return res.status(200).send("Review successfully posted");
      }
      else {
          return res.status(404).json({message: `ISBN ${isbn} not found`});
      }
  });
regd_users.delete("/auth/review/:isbn", (req, res) => {
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
