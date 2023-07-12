const Book = require("../models/bookmodel");
const asyncHandle = require("express-async-handler");

const gethome = asyncHandle(async (req, res) => {
  res.send({ message: "Welcome to the home page" });
});

const getbooks = asyncHandle(async (req, res) => {
  const books = await Book.find();
  res.send({ books });
});

const postbook = asyncHandle(async (req, res) => {
  console.log("The request body is: ", req.body);
  const { year, title, author, course, collegeId, number } = req.body;
  if (!year || !title || !author || !course || !collegeId || !number) {
    res.status(400).json({ message: "All fields mandatory" });
  }
  const book = await Book.create({
    year,
    title,
    author,
    course,
    collegeId,
    number
  });
  res.send({ message: "Book created successfully" });
});

const bookorm = asyncHandle(async (req, res) => {
  res.send({ message: "Welcome to the book form page" });
});

module.exports = { gethome, getbooks, postbook, bookorm };
