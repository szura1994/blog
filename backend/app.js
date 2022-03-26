/* app.js file will hold the express app
* which is still a nodejs server side app
* just taking advantage of express features
*/
const express = require("express");
const bodyParser = require("body-parser");
const { ArgumentOutOfRangeError } = require("rxjs");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");


const app = express();

mongoose.connect("mongodb+srv://szura1994:ybAZ5EK9iLdTXbzJ@cluster0.tvrbo.mongodb.net/node-angular-blog?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database.')
  })
  .catch(() => {
    console.log('Connection failed.')
  });

/*pass body parser then call the json method and this will return a valid
* express middleware for parsing json data
*/
app.use(bodyParser.json());
//bodyparser is capable to parsing different kinds of bodies (unused)
app.use(bodyParser.urlencoded({ extended: false }));

//for CORS
app.use((req, res, next) => {
  /*Access-Control-Allow-Origin is a clearly defined header understood by browser
  * this means no matter which domain the app which is sending the request is running on,
  * its allowed to access our resources
  *
  * first one allow which domains are able to acess our resources
  * secons one also restrict this to domains sending requests with a certain set of headers besides the default headers
  * we want to allow Origin, X-Requested-With etc.
  */
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})

//attach a middleware which only is triggered for incoming post requests
//post requests have a request body, so they have data attached to them & we need to extract the data
/*
* we can install an extra package which adds a convenience middleware which we can
* plug into our express app that will automatically extra incoming request data
* and add it as a a new fieled to that request object on which we can the conveniently access it
* **body parser** parses incoming request bodies, extracts the request data
* because that will actually be a stream of data converting it to just a data object
* we can use is something which is done by the package and it then re-adds it on a special
* property to that request object
*/

//url that starts with /api/posts will be forwarded into posts routes
app.use("/api/posts", postsRoutes);


module.exports = app;
