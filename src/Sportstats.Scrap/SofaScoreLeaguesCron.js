var cron = require('node-cron'),
    leaguesJob = require('./SofaScoreLeagues'),
    request = require('request');

tryCount = 0;



process.on('unhandledRejection', (reason, p) => {
    if (tryCount <= 5) {
        console.log('retry - ' + tryCount)
        tryCount++;
        leaguesJob.scrapLeague();
    }
    else {
        //TODO reporting error
    }
});

cron.schedule('*/1 * * * *', function () {


    var t = request.get({
        url: 'http://localhost:3000/scrap/leagues/pending',
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {

            if (data.result.docs.length > 0) {


                request.post({
                    url: 'http://localhost:3007/SofaScoreLeague',
                    json: true,
                    body: { leagues: data.result.docs }
                }, function (error, response, body) {
                    console.log(error);
                });
            }
            else {
                console.log('No Leagues To Scrap')
            }
        }
    });


}, null, true);
