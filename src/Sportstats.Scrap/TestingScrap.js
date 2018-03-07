var leaguesJob = require('./SofaScoreLeagueJob'),
    vo = require('vo'),
    request = require('request');

function* Job() {

    var t = request.get({
        url: 'http://wigserver.myvnc.com:3000/scrap/leagues/pending',
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {

            if (data.docs.length > 0) {


                request.post({
                    url: 'http://wigserver.myvnc.com:3000/SofaScoreLeague',
                    json: true,
                    body: { leagues: data.docs }
                }, function (error, response, body) {
                    console.log(error);
                });
            }
            else {
                console.log('No Leagues To Scrap')
            }
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