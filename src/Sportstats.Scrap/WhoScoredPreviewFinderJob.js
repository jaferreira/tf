var nightmare = require('nightmare'),
    tryCount = 0,
    request = require('request'),
    currentTeam = {};

process.on('unhandledRejection', (reason, p) => {
    console.error('Scrap error')
    console.error(reason)
    if (tryCount <= 5) {
        console.log('retry - ' + tryCount)
        tryCount++;
        run(currentTeam, tryCount);
    }
    else {
        //TODO reporting error
    }
});
module.exports = {
    scrapGames: function* run(competitionsToScrap) {
        nbot = nightmare({
            switches: { 'ignore-certificate-errors': true },
            show: false
        });

        console.log('start')
        z = 0;
        console.log(JSON.stringify(competitionsToScrap));
        results = yield* running(competitionsToScrap);

        console.log(JSON.stringify(results))

        // console.lorekg('before send  ->'.JSON.stringify(results));
        // request.post({
        //     url: 'http://127.0.0.1:3000/api/teams/scrap',
        //     json: true,
        //     body: results
        // }, function (error, response, body) {
        //     console.log('API - ' + body)
        // });

        nbot.end();
        nbot.proc.disconnect();
        nbot.proc.kill();
        nbot.ended = true;
        nbot = null;
        return nbot;
    }


}

function* running(games) {

    var globalMaxRetries = 5;
    var results = [];
    var retries = [];

    console.log('Competitions: ' + JSON.stringify(games));

    // Initialize retry counters
    games.forEach(league => {
        retries.push({
            permalink: league.permalink,
            maxRetries: globalMaxRetries,
            retryCount: 0
        });
    });

    for (i = 0; i < games.length; i++) {
        console.log(' --- ');
        console.log('Running [' + (i + 1) + '] of ' + games.length)
        console.log('[' + games[i].nextGame.homeTeamName + ' - ' + games[i].nextGame.awayTeamName + '] Going to start scraping url for home team: ' + games[i].nextGame.homeTeamLink);
        // results.push(yield* scrapLeagueInfo(teams[i]));
        var r = yield* findPreviews(games[i]);

        if (r != null) {
            console.log('[' + games[i].team + '] Scraping done.');
            console.log(JSON.stringify(r))
            results.push(r);
        }


    }
    // console.log('results -> ' + JSON.stringify(results));

    // nbot = nightmare({
    //     switches: { 'ignore-certificate-errors': true },
    //     show: false
    // });

    // var detail = [];
    // for (j = 0; j < results.length; j++) {
    //     var res = yield* detailGameInfo(results[j]);
    //     if(res)
    //     {
    //         detail.push(res);
    //     }
    // }

    return yield results;

}

function* findPreviews(game, retry) {
    tryCount = retry;
    currentTeam = game;

    var url = game.nextGame.homeTeamLink;

    console.log('starting Scrap Url ' + url);
    var value = yield nbot
        .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')

        .goto(url)
        .wait(1000)
        .wait('table#team-fixtures-summary')
        .evaluate(function () {

            var previews = [];

            var rows = $('table#team-fixtures-summary > tbody > tr');
            
            for (var i = 0, row; row = rows[i]; i++) {
                
                if ((row.querySelectorAll('td.toolbar.right')[0].innerText == 'Preview')) {
                    previews.push({
                        home: row.querySelectorAll('td.team.home')[0].innerText,
                        away: row.querySelectorAll('td.team.away')[0].innerText,
                        link: row.querySelectorAll('td.toolbar.right > a')[0].getAttribute('href')
                    });
                }
            }

            return previews;
        })

        .catch(error => {
            var message;
            if (typeof error.details != "undefined" && error.details != "") {
                message = error.details;
            } else if (typeof error == "string") {
                message = error;

                if (error == "Cannot read property 'focus' of null") {
                    message += " (Likely because a non-existent selector was used)";
                }
            } else {
                message = error.message;
            }
            console.log(error);

        })
    console.log(JSON.stringify(value))


    return value;

}
