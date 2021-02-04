const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Mongoose schemas define the type of data that is passed to MongoDB
const bookSchema = new Schema({
  name: String,
  genre: String,
  authorId: String,
})

// A model is akin to a collection in MongoDB
// Naming the collection 'Book', and the collection will
// contain books that match this schema
module.exports = mongoose.model('Book', bookSchema);