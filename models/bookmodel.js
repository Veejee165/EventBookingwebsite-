const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    year: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      maxlength: 30,
      required: true
    },
    author: {
      type: String,
      maxlength: 30,
      required: true
    },
    course: {
      type: String,
      maxlength: 20
    },
    id: {
      type: String,
      maxlength: 13
    },
    number: {
      type: Number
    }
  });

module.exports = mongoose.model("Book", bookSchema);

