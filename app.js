const express = require('express');
const app = express();
const PORT = 3000;

let db = {
	users: {
		a234: {
			'name': 'michel',
			'surname': 'mich',
			'role': 'admin',
			'campain' : 'deezer'
		},
		a235: {
			'name': 'michel',
			'surname': 'mich',
			'role': 'user',
			'campain': 'krowdis'
		}
	}

}

app.get('/api/users', (req, res)=> {
	const name = req.params.name
	res.json(db.users);
});


app.get('/api/users/:id', (req, res)=> {
	const id = req.params.id
	//res.json(db.users[id]);

	//res.send('<p> Nom : '+ db.users[id].name + ' son rôle : ' + db.users[id].role)

	if (db.users[id].campain == 'krowdis' || db.users[id].role == 'admin') {

		res.send('Vous êtes autorisé');
	} else {
		res.send('Vous n\'avez pas accès à cette campagne');
	}

});





app.listen(PORT, ()=>{
	console.log(`listen on port ${PORT}` );
});