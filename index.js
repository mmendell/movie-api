// eslint-disable-next-line no-use-before-define
const express = require(express);
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),
    { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

const topBooks = [
    {
        title: 'the black swan',
        author: 'nassim nicholas taleb'
    },
    {
        title: 'think again',
        author: 'adam grant'
    }
];

app.get('/', (req, res) => {
    res.send('welcome to my page');
});

app.use(express.static('public'));

app.get('/books', (req, res) => {
    res.json(topBooks);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something broke');
});

app.listen(8080, () => {
    console.log('your listening on port 8080');
});
