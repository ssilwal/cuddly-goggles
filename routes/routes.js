module.exports = (app) => {
	app.get('/', function (req, res) {
		res.render('index', {title : "Hello World"});
	});

	app.get('/home', (req, res) => {
		res.render('home');
	});

	app.get('/admin', (req, res) => {
		res.render('admin');
	});
};
