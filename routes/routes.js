module.exports = (app) => {
	app.get('/', function (req, res) {
		res.render('index', {title : "Hello World"});
	});
};
