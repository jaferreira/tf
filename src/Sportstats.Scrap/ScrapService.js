const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3007;
const sofaLeague = require('./SofaScoreLeagueJob');
const yields = require('express-yields');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.post('/SofaScoreLeague', function* (req, res) {
    console.log('Sofa League')
    var results = yield* sofaLeague.scrapLeagues(req.body.leagues);
    res.send('Hello')
  });

app.listen(port, () => {
    console.log('We are live on ' + port);
});






