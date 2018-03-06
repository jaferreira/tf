var
    vo = require('vo'),
    request = require('request');

function Job() {
    console.log('teste');


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

            if (data.docs.lenght > 0) {


                request.post({
                    url: 'http://localhost:3007/SofaScoreLeague',
                    json: true,
                    body: { leagues: data.docs }
                }, function (error, response, body) {
                    console.log(error);
                });
            }
            else
            {
                console.log('No Leagues To Scrap')
            }
        }
    });


}

Job()