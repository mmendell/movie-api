const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

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

const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    birthday: Date,
    favoriteBook: [{ type: mongoose.Schema.Types.ObjectId, ref: 'book' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const book = mongoose.model('Book', bookSchema);
const user = mongoose.model('User', userSchema);

module.exports.Book = book;
module.exports.User = user;
