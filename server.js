const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const path = require("path"); 
const authenticated = require('./middleware/authenticate');
connectDb();

const app = express();
const port = process.env.PORT;
app.use('/prac', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));

app.use(express.static('./my-angular-app'));
app.use(express.static('./adminlte-3-angular'));
app.use(express.json());
app.use(authenticated.authenticate); 

app.use("/prac", require("./routes/pracroutes"));

app.listen(port, () => {
  console.log('Server running on port', port);
});
