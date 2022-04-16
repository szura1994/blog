const mongoose = require('mongoose');

//nodejs String with uppercase 'S'
//typescript string with lowercase 's'
const postSchema = mongoose.Schema({
  //required is a type of schema type, refer to mongoose docs for more
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
