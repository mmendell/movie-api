const express = require('express'),
    bodyparser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

const fs = require('fs');
const path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a'
});

app.use(morgan('combined', { stream: accessLogStream }));

const books = [
    {
        id: 1,
        title: 'the black swan',
        details: { author: 'nassim nicholas taleb', genre: 'philosophy' }
    },
    {
        id: 2,
        title: 'think again',
        details: { author: 'adam grant', genre: 'psychology' }
    },
    {
        id: 3,
        title: 'the intelligent investor',
        details: { author: 'benjamin graham', genre: 'finance' }
    },
    {
        id: 4,
        title: 'nudge',
        details: { author: 'cass sunstein, richard thaler', genre: 'psychology' }
    },
    {
        id: 5,
        title: 'the secret life of groceries',
        details: { author: 'benjamin lorr', genre: 'social science' }
    }
];

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
    res.json(books);
});

// individual book info

app.get('/books/:title', (req, res) => {
    res.json(
        books.find((book) => {
            return book.title === req.params.title;
        })
    );
});

// add data

app.post('/books', (req, res) => {
    const newBook = req.body;

    if (!newBook.title) {
        const message = 'you are lacking critical information';
        res.status(400).send(message);
    } else {
        newBook.id === uuid.v4();
        books.push(books);
        res.status(201).send(newBook);
    }
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
