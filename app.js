const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // recupération data form vers back
const multer = require('multer');
const upload = multer();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); // gérer une autorisation
const mongoose = require('mongoose');

const secret = 'dskndjsnbdjsbcnsdsdsdnddsfdjjgj12344';

// Partie mongodb

// connection
mongoose.connect('mongodb://thibaut:mouloud007@ds237192.mlab.com:37192/express');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect to my db'));
db.once('open', () => {
	console.log('connected to the DB :)');
});

// schema mongoose

const movieSchema = mongoose.Schema({
	movietitle: String,
	movieyear: Number
});

const PORT = 3000;
let frenchMovies = [];

app.use('/public', express.static('public'));
// methode pour toutes les route sinon pour route unique mettre ds la methode post
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressJwt({ secret: secret }).unless({ path: ['/', '/movies', '/movie-search', '/login']})); // seul la page de login à autorisation

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res)=> {
	//res.send('<p>Hello</p>');
	res.render('index');
});

// app.get('/movie-details', (req, res)=>{
// 	res.render('movie-details');
// });

app.get('/movies', (req, res)=>{
	//res.send('Bientôt des films ici même');
	const title = 'Film français des trente dernières années';


	frenchMovies = [
		{title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001},
		{title: 'Buffet froid', year: 1979},
		{title: 'Le dîner de cons', year: 1998},
		{title: 'De rouille et d\'os', year: 2012}
	];
	res.render('movies', { movies : frenchMovies, title: title });
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })
//Méthode Post
// app.post('/movies', urlencodedParser, (req, res)=>{
	
// 	const newMovie = { title:  req.body.movietitle, year: req.body.movieyear };
// 	frenchMovies = [... frenchMovies, newMovie];
// 	//frenchMovies.push(newMovie);
// 	console.log(frenchMovies);
// 	res.sendStatus(201);
// });

app.post('/movies', upload.fields([]), (req, res) => {
	if(!req.body) {
		return res.sendStatus(500);
	} else {
		const formData = req.body;
		console.log(formData);
		const newMovie = { title:  req.body.movietitle, year: req.body.movieyear };
		frenchMovies = [... frenchMovies, newMovie];
		//res.json({hello: 'gege', bonjour: 'fe'})
		res.sendStatus(201);
	}
});

app.get('/movies/add', (req, res)=>{
	res.send('on ajoute des films');
});

app.get('/movie-search', (req, res)=>{
	res.render('movie-search');
});


// envoyer un parametre par l'url
app.get('/movies/:id/:title', (req, res)=>{
	const id = req.params.id;
	const title = req.params.title;; 
	//res.send(`le num du film est ${id}`);
	res.render('movie-details', { movieId: id, title: title });
});

app.get('/login', (req, res)=>{
	res.render('login', { title: 'Espace membre ' });
});

const fakeUser = { email: 'thib', password: 'azerty' };

app.post('/login', urlencodedParser, (req, res) => {
	if(!req.body) {
		return res.sendStatus(500);
	} else {
		const formData = req.body;
		console.log(formData);

		if (fakeUser.email == formData.email && fakeUser.password == formData.password ) {
			const myToken = jwt.sign( { iss: 'http://expressmovies.fr', user: 'Thib', role: 'moderateur'}, secret );
			res.json( myToken );
			/*
			res.json( {
				email: 'thib',
				favoriteMovie: 'Titanic',
				favoriteMovieTheater: 'dîner de con',
				lastLoginDate: new Date()
			} );*/
		} else {
			res.sendStatus(401);
		}
	}

});

app.get('/member-only', (req, res)=> {
	console.log('req-user', req.user);
	res.send(req.user);
});

app.listen(PORT, ()=>{
	console.log(`listen on port ${PORT}` );
});