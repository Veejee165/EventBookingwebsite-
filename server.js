const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const path = require("path"); 
const cors = require('cors');
connectDb();
const app = express();
const port = process.env.PORT;

app.use(express.static('./my-angular-app'));
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
app.use("/prac", require("./routes/pracroutes"));
app.use(cors());
app.listen(port, () => {
  console.log('Server running on port', port);
});
