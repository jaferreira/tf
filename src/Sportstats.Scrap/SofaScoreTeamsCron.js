var cron = require('node-cron'),    
    request = require('request');

tryCount = 0;



cron.schedule('*/1 * * * *', function () {


    var t = request.get({
        url: 'http://wigserver.myvnc.com:3000/scrap/teams/pending',
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
                    url: 'http://localhost:3007/SofaScoreTeam',
                    json: true,
                    body: { teams: data.result.docs }
                }, function (error, response, body) {
                    console.log(error);
                });
            }
            else {
                console.log('No Teams To Scrap')
            }
        }
    });


}, null, true);
