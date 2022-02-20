/* app.js file will hold the express app
* which is still a nodejs server side app
* just taking advantage of express features
*/
const express = require("express");
const bodyParser = require("body-parser");
const { ArgumentOutOfRangeError } = require("rxjs");
const mongoose = require("mongoose");

const Post = require('./models/post');

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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
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

app.post("/api/posts", (req, res, next) => {
  //we can instatiate this as the model method gives a constuructor functions
  //that allows construction of a new js object
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  /*
  * to save to db. mongo saves entries as 'documents'
  * documents are stored in collections
  * the name of the collection will always be the plural form of your model name
  * i.e. posts
  *
  * added a then block, createPost is retrieved i.e. the post that is created
  * send back [to service] post id in response
  */
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully.",
      postId: createdPost._id
    })
  });
});

/*
* registered path to fetch posts if we send a get request to /posts
*/
app.get('/api/posts',(req, res, next) => {

  //retrieve all posts, check docs for more
  Post.find()
    .then(documents => {
      res.status(200).json(
        {
          message: 'Posts fetched successfully!',
          posts: documents
        }
      )
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json( { message: 'Post deleted.'} );
});

module.exports = app;
