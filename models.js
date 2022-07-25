const mongoose = require('mongoose');
let bookSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String,
    },
    Author: {
        Name: String,
        Bio: String
    },
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    user: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: Date,
    favoriteBook: [{ type: mongoose.Schema.types.ObjectId, ref: 'Book' }]
});

let book = mongoose.model('Book', bookSchema);
let user = mongoose.model('User', userSchema);

module.exports.Book = book;
module.exports.User = user;
