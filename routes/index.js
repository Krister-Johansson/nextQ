var routes = require('express').Router();

routes.get('/', function(req, res){
  res.render('index');
});
routes.get('/api', function(req, res){
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;