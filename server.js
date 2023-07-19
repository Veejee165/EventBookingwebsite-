const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const path = require("path"); 
const authenticated = require('./middleware/authenticate');
const cors = require('cors');
connectDb();

const app = express();
const port = process.env.PORT;
const corsOption = 'http://localhost:4200/';
app.use(cors({corsOption}));
app.use(express.static('./my-angular-app'));
app.use(express.static('./adminlte-3-angular'));
app.use(express.json());
app.use("/prac", require("./routes/pracroutes"));

app.listen(port, () => {
  console.log('Server running on port', port);
});
