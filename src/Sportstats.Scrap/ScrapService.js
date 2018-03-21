const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3007;
const sofaLeague = require('./SofaScoreLeagueJob');
const sofaTeams = require('./SofaScoreTeamsJob');
const whoScoredPreviewFinder = require('./WhoScoredPreviewFinderJob');
const whoScoredPreviewScraper = require('./WhoScoredPreviewScraperJob');

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

app.post('/SofaScoreTeam', function* (req, res) {
  console.log('Sofa Teams')
  var results = yield* sofaTeams.scrapTeams(req.body.teams);
  res.send('Hello')
});

app.post('/WhoScoredPreviewFinder', function* (req, res) {
  console.log('WhoScored Preview Finder')
  var results = yield* whoScoredPreviewFinder.scrapGames(req.body.games);
  res.send('Hello')
});

app.post('/WhoScoredPreviewScraper', function* (req, res) {
  console.log('WhoScored Preview Scraper')
  var results = yield* whoScoredPreviewScraper.scrapGames(req.body.games);
  res.send('Hello')
});


app.get('/helloscrap', function* (req, res) {
  res.send('Hello')
});

app.listen(port, () => {
  console.log('We are live on ' + port);
});






