const express = require("express");
const multer = require("multer");
const { create } = require("../models/post");
const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  //key 1 destination is unction which will be executed whenever multer tries to save a file
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images") //relative to the path where server.js file is stored
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now()+ '.' + ext);
  }
});

/* first argument is path
* second argument : multer will try to extract a single file form the incoming request
* and will try to find it on an image property in the request body
*/
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  //we can instatiate this as the model method gives a constuructor functions
  //that allows construction of a new js object
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
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
      post: {
        /*next gen Javascript feature where you create
        * a new object and use a spread operator to copy all properties
        * of another object then simple add or overrite some selected properties
        * ...createdPost will create an object with all the properties of the created post
        * and it will set that extra
        */
        ...createdPost,
        id: createdPost._id
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
    })
  });
});

router.put(
  "/:id",
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file){
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({_id: req.params.id}, post).then(
      result => {
        res.status(200).json({
          message: 'Update Successful'
      });
    }
  )
});

/*
* registered path to fetch posts if we send a get request to /posts
*/
router.get("",(req, res, next) => {

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

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    }else {
      res.status(404).json({message: 'Post not found'})
    }
  })
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json( { message: 'Post deleted.'} );
});

module.exports = router;
