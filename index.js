/* eslint-disable one-var */
const mongoose = require('mongoose');
const Models = require('./models');

const Books = Models.Book;
const Users = Models.User;

const express = require('express'),
    // eslint-disable-next-line no-unused-vars
    uuid = require('uuid'),
    fs = require('fs'),
    path = require('path');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');

app.use(cors());

const { check, validationResult } = require('express-validator');

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const morgan = require('morgan');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a'
});

app.use(morgan('combined', { stream: accessLogStream }));

// handling for static pages

app.use(express.static('public'));

// get request to produce json of all books

app.get(
    '/books',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Books.find()
            .then((books) => {
                res.status(201).json(books);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    }
);

// individual book info by title

app.get(
    '/books/:title',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Books.findOne({ title: req.params.title })
            .then((book) => {
                res.json(book);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    }
);

// individual book data by genre

app.get(
    '/books/genre/:name',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.log('random stuff', req.body);

        Books.findOne({ 'genre.name': req.params.name })

            .then((genre) => {
                res.json(genre);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    }
);

// individual book by author

app.get(
    '/books/author/:name',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.log('random stuff', req.body);
        Books.findOne({ 'author.name': req.params.name })
            .then((book) => {
                res.json(book);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    }
);

// adds user

app.post(
    '/users',
    [
        check('username', 'username is required').isLength({ min: 5 }),
        check(
            'username',
            'username only contains non alphanumeric characters - not allowed'
        ).isAlphanumeric(),
        check('password', 'password is required').not().isEmpty(),
        check('email', 'email does not appear to be valid').isEmail()
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.password);
        Users.findOne({ username: req.body.username })
        // eslint-disable-next-line consistent-return
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.user + 'already exists.');
                    // eslint-disable-next-line no-else-return
                } else {
                    Users.create({
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        birthday: req.body.birthday
                    })
                        .then((user) => {
                            res.status(201).json(user);
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('error' + error);
                        });
                }
            })
            .catch((error) => {
                console.error('something new', error);
                res.status(500).send('error: ' + error);
            });
    }
);

// get all users

app.get(
    '/users',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.find()
            .then((users) => {
                res.status(201).json(users);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    }
);

// post new book

app.post(
    '/books',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Books.findOne({ title: req.body.title })
        // eslint-disable-next-line consistent-return
            .then((book) => {
                console.log('gsdfg', req.body);
                if (book) {
                    console.log('sdad1', req.body);
                    return res.status(400).send(req.body.book + 'already exists.');
                    // eslint-disable-next-line no-else-return
                } else {
                    Books.create({
                        title: req.body.title,
                        description: req.body.description,
                        genre: {
                            name: req.body.name,
                            description: req.body.description
                        },
                        author: {
                            name: req.body.name,
                            bio: req.body.bio,
                            birth: req.body.birth
                        }
                    })
                        .then((book) => {
                            res.status(201).json(book);
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('error' + error);
                        });
                }
            })
            .catch((error) => {
                console.error('something new', error);
                res.status(500).send('error: ' + error);
            });
    }
);

// get specific user

app.get(
    '/users/:username',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOne({ user: req.params.username })
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    }
);

// update certain details

app.put(
    '/users/:username',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { user: req.params.user },
            {
                $set: {
                    username: req.body.username,
                    password: req.params.password,
                    email: req.params.email,
                    birthday: req.params.birthday
                }
            },
            { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error ' + err);
                } else {
                    res.json(updatedUser);
                }
            }
        );
    }
);

// add favoriteBook

app.post(
    '/users/:username/books/:bookId',
    // passport.authenticate('jwt', { session: false }),

    (req, res) => {
        Users.findOneAndUpdate(
            { username: req.params.username },
            {
                $push: { favoriteBooks: req.params.bookId }
            },
            { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            }
        );
    }
);

// removes an entry

app.delete(
    '/books/:id',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const book = Books.find((book) => {
            return book.id === req.params.id;
        });

        if (book) {
            Books = Books.filter((obj) => {
                return obj.id !== req.params.id;
            });
            res.status(201).send(`The book ${req.params.id} was deleted.`);
        }
    }
);

// removes user by username

app.delete(
    '/users/:username',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndRemove({ username: req.params.username })
            .then((user) => {
                if (!user) {
                    res.status(400).send(req.params.username + ' was not found');
                } else {
                    res.status(200).send(req.params.username + ' was deleted.');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// error handling

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something broke');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Your listening on Port ' + port);
});

// app.listen(8080, () => {
//     console.log('your listening on port 8080');
// });
