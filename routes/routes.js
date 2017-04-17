module.exports = (app, twilioClient, db, auth) => {
	app.get('/', function (req, res) {
		res.render('index', {title : "Hello World"});
	});

	app.post('/login', (req, res) => {
		const { uni, password } = req.body;
		auth.signInWithEmailAndPassword(uni, password)
		.then(user => {
			req.session.uid = user.uid;
			req.session.email = user.email;
			res.redirect('/home');
		}).catch(error => {
			console.log(error);
		})
	});

	app.post('/logout', (req, res) => {
		req.session.reset();
		res.redirect('/');
	});

	app.post('/orderSubmit', (req, res) => {
		const { main, special, phoneNumber } = req.body;
		const key = db.ref('/orders').push().key;
		db.ref(`/orders/${key}`).update({
			main: main,
			special: special,
			phoneNumber: '+17145603483',
			user_uid: req.session.uid,
			uid: key
		}).then(() => {
			res.redirect('/home');
		});
	})

	app.post('/orderComplete', (req, res) => {
		const { phoneNumber, uid } = req.body;
		db.ref('/orders').child(uid).remove()
			.then(() => {
				twilioClient.messages.create({
					body: 'Your food is ready you fucking weeb',
					to: phoneNumber,
					from: '+16572124392',
				}, error => {
					console.log(error);
				});
				res.redirect('/admin');
			})
	})

	app.get('/home', (req, res) => {
		if(req.session && req.session.user) {
			res.render('home', {email: req.session.email});
		} else {
			res.redirect('/');
		}
	});

	app.get('/admin', (req, res) => {
		db.ref('/orders').once('value').then(snapshot => {
			const orders = [];
			const keys = Object.keys(snapshot.val());
			keys.map(key => {
				orders.push(snapshot.val()[key]);
			})
			res.render('admin', { orders: orders });
		})
	});
};
