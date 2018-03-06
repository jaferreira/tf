var express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 3000,
    metricsPort = process.env.PORT || 3001,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressMetrics = require('express-metrics'),

    // Models
    TeamToScrap = require('./Models/TeamToScrap'),
    TeamInfo = require('./Models/TeamInfo');
    LeagueToScrap = require('./Models/LeagueToScrap'),
    LeagueInfo = require('./Models/LeagueInfo');


// Mongoose Configuration
var mongoConnString = 'mongodb://localhost/sportstats';
mongoose.Promise = global.Promise;

console.log("Checking MongoDb connection...");
mongoose.connect(mongoConnString, function (err) {
    if (err) {
        console.error('Error connecting to MongoDB: ' + mongoConnString);
        console.log("The aplication is terminating...");
        process.exit();
    }

    // Metrics Configuration
    app.use(expressMetrics({
        port: metricsPort
    }));

    app.use(cors());

    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));

    app.get('/', function (req, res) {
        res.send('Sportstats API');
    });

    // Routes
    var scrapRoutes = require('./Routes/ScrapRoutes');
    scrapRoutes(app);
    var infoRoutes = require('./Routes/InfoRoutes');
    infoRoutes(app);


    app.listen(port);
    console.log('Sportstats API server started on: ' + port);
});