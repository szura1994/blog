/* app.js file will hold the express app
* which is still a nodejs server side app
* just taking advantage of express features
*/
const express = require('express');

const app = express();

app.use('/api/posts',(req, res, next) => {
  const posts = [
    {
      id: 'sdfwefsd1224',
      title: 'First server-sdie post',
      content: 'This is coming from the server'
    },
    {
      id: 'wdnwe221243',
      title: 'Second server-sdie post',
      content: 'This is also coming from the server!'
    }
  ];
  res.status(200).json(
    {
      message: 'Posts fetched successfully!',
      posts: posts
    }
  )
});

module.exports = app;
