const express = require('express');
const app = express();

const PORT = 3000;

app.use('/public', express.static('public'));


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
	res.render('movies');
});

app.get('/movies/add', (req, res)=>{
	res.send('on ajoute des films');
});

// envoyer un parametre par l'url
app.get('/movies/:id/:title', (req, res)=>{
	const id = req.params.id;
	const title = req.params.title;; 
	//res.send(`le num du film est ${id}`);
	res.render('movie-details', { movieId: id, title: title });
});


app.listen(PORT, ()=>{
	console.log(`listen on port ${PORT}` );
});