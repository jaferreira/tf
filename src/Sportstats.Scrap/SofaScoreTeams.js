var teamsJob = require('./SofaScoreTeamsJob');
var vo = require('vo');

function* Job() {
    console.log('hello job')
    var results = yield teamsJob.scrapTeams(['https://www.sofascore.com/team/football/manchester-city/17',
    'https://www.sofascore.com/team/football/manchester-united/35',
    'https://www.sofascore.com/team/football/liverpool/44',
    'https://www.sofascore.com/team/football/tottenham-hotspur/33'])

}


vo(Job)(function (err, titles) {

});