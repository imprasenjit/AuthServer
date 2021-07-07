const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
//const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const accessTokenSecret = 'secret123';

app.get('/', (req, res) => {
  res.send('<h1>Hello Prasenjit Das</h1>')
  res.sendStatus(201);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({
      token: jsonwebtoken.sign({ user: username }, accessTokenSecret)
    });
  } else {
    res.sendStatus(401);
  }
  
});
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jsonwebtoken.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

app.get('/users',authenticateJWT,async (req, res) => {
  try {    
      const users = await axios.get(`https://jsonplaceholder.typicode.com/users`);
      console.log('USERS :', users.data);
      res.json(users.data);
      res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }

});
app.listen(3001);

console.log('App running on localhost:3001');