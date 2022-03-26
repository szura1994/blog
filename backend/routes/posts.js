const express = require("express");
const Post = require('../models/post');

const router = express.Router();

router.post("", (req, res, next) => {
  //we can instatiate this as the model method gives a constuructor functions
  //that allows construction of a new js object
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post).then(
    result => {
      res.status(200).json({
        message: 'Update Successful'
    });
    }
  )
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
