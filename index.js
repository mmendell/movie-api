const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models');
const morgan = require('morgan');
const Books = Models.Book;
const Users = Models.User;

const fs = require('fs');
const path = require('path');
const { error } = require('console');
const { title } = require('process');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a'
});

app.use(morgan('combined', { stream: accessLogStream }));

mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopolgy: true });


// send you to home page

app.get('/', (req, res) => {
    res.send('welcome to my page');
});

// handling for static pages

app.use(express.static('public'));

// handles basic documentation page

app.get('/documentation.html', (req, res) => {
    res.send('succesful get request to get data of all books stored');
});

// get request to produce json of all books

app.get('/books', (req, res) => {
    Books.find()
        .then((books) => {
            res.status(201).json(books);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});

// individual book info

app.get('/books/:title', (req, res) => {
    Books.findOne({ title: req.params.title })
        .then((book) => {
            res.json(book);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});

// add book data

app.post('/books', (req, res) => {
    Books.findOne({ title: req.params.title })
        .then((book) => {
            if (book){
                return res.status(400).send(req.params.title + 'book already exists.');
            } else {
                Books
                    .create({
                        title: req.body.title,
                        description: req.body.description,
                        genre: req.body.name,
                    })
            }
        })
});

// adds user

app.post('/users', (req, res) => {
    Users.findOne({ user: req.body.user })
        // eslint-disable-next-line consistent-return
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists.');
            // eslint-disable-next-line no-else-return
            } else {
                Users
                    .create({
                        user: req.body.user,
                        Password: req.params.password,
                        email: req.params.email,
                        birthday: req.params.birthday
                    })
                    .then((user) => { res.status(201).json(user);})
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('error' + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('error: ' + error);
        });
});

// get all users

app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + error);
        });
});

// get specific user

app.get('/users/:user', (req, res) => {
    Users.findOne({ user: req.params.user })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});

// update certain details

app.put('/users/:user', (req, res) => {
    Users.findOneAndUpdate({ user: req.params.user }, { $set: {
        user: req.body.user,
        password: req.params.password,
        email: req.params.email,
        birthday: req.params.birthday
    }
    },
    { new: true },
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// removes an entry

app.delete('/books/:id', (req, res) => {
    const book = books.find((book) => {
        return book.id === req.params.id;
    });

    if (book) {
        // eslint-disable-next-line no-const-assign
        books = books.filter((obj) => {
            return obj.id !== req.params.id;
        });
        res.status(201).send(`The book ${req.params.id} was deleted.`);
    }
});

// error handling

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something broke');
});

app.listen(8080, () => {
    console.log('your listening on port 8080');
});
