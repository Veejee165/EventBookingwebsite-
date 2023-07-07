const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const path = require("path"); 

connectDb();
const app = express();
const port = process.env.PORT;


// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the views directory
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
app.use("/prac", require("./routes/pracroutes"));

app.listen(port, () => {
  console.log('Server running on port', port);
});
