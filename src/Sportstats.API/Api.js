const debug = require('debug')('Sportstats.API')
const name = 'API Server'

var logger = require('./Logger.js'),
    morgan = require('morgan'),
    express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 3000,
    metricsPort = process.env.PORT || 3001,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressMetrics = require('express-metrics'),
    swaggerUi = require('swagger-ui-express'),
    swaggerJSDoc = require('swagger-jsdoc')
    upsertMany = require('@meanie/mongoose-upsert-many'),

    // Models
    TeamToScrap = require('./Models/TeamToScrap'),
    TeamInfo = require('./Models/TeamInfo');
    LeagueToScrap = require('./Models/LeagueToScrap'),
    LeagueInfo = require('./Models/LeagueInfo');


// Mongoose Configuration
var mongoConnString = 'mongodb://localhost/sportstats';
mongoose.Promise = global.Promise;
mongoose.plugin(upsertMany);

// debug('Booting %s', name);

logger.info("Checking MongoDb connection...");
mongoose.connect(mongoConnString, function (err) {
    if (err) {
        console.error('Error connecting to MongoDB: ' + mongoConnString);
        console.log("The aplication is terminating...");
        process.exit();
    }

    // Swagger
    // Swagger definition
    // You can set every attribute except paths and swagger
    // https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
    var swaggerDefinition = {
        info: { // API informations (required)
            title: 'Sportstats', // Title (required)
            version: '0.1.0', // Version (required)
            description: 'Sportstats API', // Description (optional)
        },
        host: 'localhost:3000', // Host (optional)
        basePath: '/', // Base path (optional)
    };

    // Options for the swagger docs
    var options = {
        // Import swaggerDefinitions
        swaggerDefinition: swaggerDefinition,
        // Path to the API docs
        apis: ['./Routes/*.js']
    };

    // Initialize swagger-jsdoc -> returns validated swagger spec in json format
    var swaggerSpec = swaggerJSDoc(options);

    // Serve swagger docs the way you like (Recommendation: swagger-tools)
    app.get('/api-docs.json', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    // Swagger UI
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


    // Metrics Configuration
    app.use(expressMetrics({
        port: metricsPort
    }));

    app.use(morgan('dev'));

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
    logger.info('Sportstats API server started on: ' + port);
});