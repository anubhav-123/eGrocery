const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const secrets = require('./server/secrets');
const config = require('./server/config');
const queries = require('./server/queries');

const app = express();

app.use(session({
  secret: secrets.sessionSecret,
  saveUninitialized: false,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

// DATABASE CONFIG

let pool = new pg.Pool(config.config);

// KNEX/BOOKSHELF

// const knex = require('knex')({
//   client: 'pg',
//   connection: config
// });

// const bookshelf = require('bookshelf')(knex);

// var Product = bookshelf.Model.extend({
// 	tableName: 'Products',

// });

// START SERVER

app.set('port', (process.env.PORT || 3000));

app.use(express.static('dist'));
app.use(bodyParser.json());

app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});

app.get('/api/products', (req, res) => {
	queries.getProducts(pool, req, res);
});

app.get('/api/products/:id', (req, res) => {
	queries.getProductById(pool, req, res);
});

app.get('/checklogin', (req, res) => {
	if(req.user) {
		res.status(200).send(true);
	} else {
		res.status(200).send(false);
	}
});

app.get('/logout', (req, res) => {
	req.logout();
	res.status(200).send(true);
});

app.post('/register', (req, res) => {
	queries.createUser(pool, req, res);
	res.status(200).send({redirect: '/#/usercreated'});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	queries.findUser(pool, username, password, (user) => {
  		if (!user) {
  			return done(null, false);
  		}
  		return done(null, user);
  	});
  }
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send({redirect: '/#/login?login=failed'}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send({redirect: '/#/'});
    });
  })(req, res, next);
});

