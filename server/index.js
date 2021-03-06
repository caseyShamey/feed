const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const faker = require('faker');
const knex = require('../database/knex.js');

const app = express();

app.use(cors());
app.use(express.static(`${__dirname}/../client/dist`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// feed endpoint
app.get('/espn/feeds', (req, res) => {
  knex.select().from('feeds').orderBy('timestamp', 'desc').limit(10)
    .then((data) => {
      res.send(data);
    });
});

app.post('/feeds', (req, res) => {
  knex('feeds').insert({
    author: `${faker.name.lastName()} ${faker.name.lastName()}`,
    authorphoto: `https://loremflickr.com/320/240/face?lock=${faker.random.number(1000)}`,
    title: `${faker.lorem.words()}`,
    bigphoto: `https://loremflickr.com/620/400/football?lock=${faker.random.number(1000)}`,
    smallphoto: `https://loremflickr.com/1280/720/football?lock=${faker.random.number(1000)}`,
    newsfeed: `${faker.lorem.paragraph()}`,
    videoclip: `${faker.internet.url()}`,
    timestamp: `${faker.date.between('2018-11-01', '2019-02-01')}`,
  })
    .then(() => {
      knex.select().from('feeds').orderBy('timestamp', 'desc').limit(10)
        .then((data) => {
          res.send(data);
        });
    });
});

// Serve static assets if in production
// check to see if the node environment is in production

// if (process.env.NODE_ENV === 'production') {
//   // set static folder
//   // everyone is using create-react-app
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
