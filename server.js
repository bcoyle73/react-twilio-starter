var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
var app = express();

var tokens = require('./server/routes/tokens');
var calls = require('./server/routes/calls');
var sms = require('./server/routes/sms');
var taskrouter = require('./server/routes/taskrouter');
//var chat = require('./server/routes/chat');

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use( bodyParser.json() );
app.use(express.static(path.join(__dirname, 'build')));
app.use(cookieParser());

app.use(function timeLog(req, res, next) {
  console.log('Main Request - Time: ', Date.now());
  console.log(req.originalUrl);
  next();
});

//setup routes all scoped to /api
app.use('/api/tokens', tokens);
app.use('/api/calls', calls);
app.use('/api/sms', sms);
app.use('/api/taskrouter', taskrouter);
//app.use('/api/chat', chat);

app.listen(port, function (err){
  if (err) throw err;
  console.log("Server running on port " + port);
});
