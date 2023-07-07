const Book = require("../models/bookmodel")
const asyncHandle = require("express-async-handler")

const gethome = asyncHandle( async (req,res)=>{
     res.render('home');
     })

const getbooks = asyncHandle( async (req,res)=>{
    const books = await Book.find()
    console.log(books)
    res.render('search_results', { books: books });
})

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
    res.render('home');
  });
  

const bookorm = asyncHandle( async (req,res)=>{
    res.render('addbook');
})

module.exports = {gethome, getbooks, postbook, bookorm}