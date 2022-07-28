/* eslint-disable prefer-const */
const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: {
        name: String,
        description: String
    },
    author: {
        name: String,
        bio: String,
        birth: String
    },
    featured: Boolean
});

let userSchema = mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    birthday: Date,
    favoriteBook: [{ type: mongoose.Schema.Types.ObjectId, ref: 'book' }]
});

const book = mongoose.model('Book', bookSchema);
const user = mongoose.model('User', userSchema);

module.exports.Book = book;
module.exports.User = user;
