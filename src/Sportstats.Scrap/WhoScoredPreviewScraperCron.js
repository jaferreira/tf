var cron = require('node-cron'),
    request = require('request');

tryCount = 0;



cron.schedule('*/1 * * * *', function () {
    console.log('Preview Scraper')

    var objs = [{ away: "Blackpool", home: "Milton Keynes Dons", link: "/Matches/1193046/Preview/England-League-1-2017-2018-Milton-Keynes-Dons-Blackpool" }];

    if (objs.length > 0) {

        request.post({
            url: 'http://127.0.0.1:3007/WhoScoredPreviewScraper',
            json: true,
            body: { games: objs }
        }, function (error, response, body) {
            console.log(error);
        });
    }
    else {
        console.log('No Previews To Scrap')
    }

    // var t = request.get({
    //     url: 'http://127.0.0.1:3000/api/leagues/scrap/pending',
    //     json: true,
    //     headers: { 'User-Agent': 'request' }
    // }, (err, res, data) => {

    //     var objs = [{ away: "Blackpool", home: "Milton Keynes Dons", link: "/Matches/1193046/Preview/England-League-1-2017-2018-Milton-Keynes-Dons-Blackpool" }];

    //     if (err) {
    //         console.log('Error:', err);
    //     } else if (res.statusCode !== 200) {
    //         console.log('Status:', res.statusCode);
    //     } else {

    //         if (data.result.docs.length > 0) {

    //             request.post({
    //                 url: 'http://127.0.0.1:3007/WhoScoredPreviewScraper',
    //                 json: true,
    //                 body: { games: data.result.docs }
    //             }, function (error, response, body) {
    //                 console.log(error);
    //             });
    //         }
    //         else {
    //             console.log('No Previews To Scrap')
    //         }
    //     }
    // });


}, null, true);
