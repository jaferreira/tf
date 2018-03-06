var leaguesJob = require('./SofaScoreLeagueJob'),
    vo = require('vo'),
    request = require('request');

function* Job() {


    request.get({
        url: 'http://wigserver.myvnc.com:3000/scrap/leagues/pending',
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            console.log(data.docs)
            tryCount = 0;
            console.log('hey');
            yield leaguesJob.scrapLeagues(data.docs);
        }
    });

    // console.log('hello job')
    // var results = yield teamsJob.scrapTeams(['https://www.sofascore.com/team/football/manchester-city/17',
    // 'https://www.sofascore.com/team/football/manchester-united/35',
    // 'https://www.sofascore.com/team/football/liverpool/44',
    // 'https://www.sofascore.com/team/football/tottenham-hotspur/33'])

}


vo(Job)(function (err, titles) {

});