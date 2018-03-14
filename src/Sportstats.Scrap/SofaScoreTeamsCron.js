var cron = require('node-cron'),    
    request = require('request');

tryCount = 0;



cron.schedule('*/1 * * * *', function () {
    console.log('start Teams')

    var t = request.get({
        url: 'http://127.0.0.1:3000/api/teams/scrap/pending',
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
                    url: 'http://127.0.0.1:3007/SofaScoreTeam',
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
