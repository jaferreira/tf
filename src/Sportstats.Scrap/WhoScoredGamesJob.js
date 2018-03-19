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
    scrapTeams: function* run(teamsToScrap) {
        nbot = nightmare({
            switches: { 'ignore-certificate-errors': true },
            show: false
        });

        console.log('start')
        z = 0;
        results = yield* running(teamsToScrap);
        //console.log(JSON.stringify(results))

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
        console.log('[' + games[i].name + '] Going to start scraping url ' + games[i].providers[0].link);
        // results.push(yield* scrapLeagueInfo(teams[i]));
        var r = yield* scrapGameInfo(games[i]);

        if (r != null) {
            console.log('[' + games[i].name + '] Scraping done.');
            console.log(JSON.stringify(r))
            results.push(r);
        }
        else {
            console.log('[' + games[i].name + '] Scraping error.');
            // var retriesInfo = {};
            // for (var j in retries) {
            //     if (retries[j].permalink == teams[i].permalink) {
            //         retriesInfo = retries[j];
            //         break;
            //     }
            // }
            // var retryCount = retriesInfo.retryCount;
            // var maxRetries = retriesInfo.maxRetries;

            // console.log('[' + teams[i].name + '] Retry information: RetryCount: ' + retryCount + ' (max: ' + maxRetries + ')');
            // if (retriesInfo && retryCount <= maxRetries) {
            //     // update retry information
            //     for (var k in retries) {
            //         if (retries[k].permalink == teams[i].permalink) {
            //             retries[k].retryCount++;
            //             break;
            //         }
            //     }
            //     console.log('[' + teams[i].name + '] RetryCount (' + retryCount + ') less the max (' + maxRetries + '), trying one more time. Decremented i: ' + (i - 1));
            //     i--;
            // }
            // else {
            //     console.log('[' + teams[i].name + '] Max retries reached, going to next league (i: ' + i + ')');
            // }
        }

    }
    // console.log('results -> '. JSON.stringify(results))

    return yield results;

}

function* scrapGameInfo(game, retry) {
    tryCount = retry;
    currentTeam = game;
    var url = 'https://www.whoscored.com/Matches/1193057/Preview/England-League-1-2017-2018-Doncaster-Bradford';
    console.log('starting Scrap Url ' + url);
    var value = yield nbot
        .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')

        .goto(url)
        .wait(1000)
        .wait('table#team-fixtures-summary')
        .evaluate(function (team) {


            var rows = $('table#team-fixtures-summary > tbody > tr');
            var link = '';
            var home = '';
            var away = '';
            for (var i = 0, row; row = rows[i]; i++) {
                home = row.querySelectorAll('td.team.home')[0].innerText;
                away = row.querySelectorAll('td.team.away')[0].innerText;
                if ((row.querySelectorAll('td.toolbar.right')[0].innerText == 'Preview') && (home == 'Stoke' && away == 'Everton')) {
                    link = row.querySelectorAll('td.toolbar.right > a')[0].getAttribute('href');
                    break;
                }
                else {
                    home = '';
                    away = '';
                }
            }



            var result = {
                home: home,
                away: away,
                link: link
            }


            return result

        }, team)

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
        console.log(value.link.length)
    if (value.link.length > 0) {
        console.log('value')
        var data = yield nbot
            .goto('https://www.whoscored.com' + value.link)
            .wait('.pitch')
            .evaluate(function () {

                var homeSquad = $('div.pitch > .home > ul')
                var homeLineup = [];
                var awayLineup = [];
                for (var i = 0, row; row = homeSquad[i]; i++) {
                    var playerData = $('div.pitch > .home > ul')[3].getAttribute('title').split('(');

                    homeLineup.push({
                        top: row.style.top,
                        left: row.style.left,
                        right: row.style.right,
                        name: playerData[0], //row.querySelectorAll('.player-name-wrapper')[0].innerText
                        position: playerData[0].replace(')', '')
                    })
                }

                var awaySquad = $('div.pitch > .away > ul')
                for (var i = 0, row; row = awaySquad[i]; i++) {
                    awayLineup.push({
                        top: row.style.top,
                        left: row.style.left,
                        right: row.style.right,
                        name: row.querySelectorAll('.player-name-wrapper')[0].innerText
                    })
                }
                var rows = $('div#missing-players > .home > table > tbody tr')
                var missingHomePlayers = [];

                for (var i = 0, row; row = rows[i]; i++) {
                    missingHomePlayers.push({
                        name: row.querySelectorAll('.pn')[0].innerText,
                        reason: row.querySelectorAll('.reason > span')[0].getAttribute('title'),
                        status: row.querySelectorAll('td')[2].innerText
                    })
                }
                rows = $('div#missing-players > .away > table > tbody tr')
                var missingAwayPlayers = [];
                for (var i = 0, row; row = rows[i]; i++) {
                    missingAwayPlayers.push({
                        name: row.querySelectorAll('.pn')[0].innerText,
                        reason: row.querySelectorAll('.reason > span')[0].getAttribute('title'),
                        status: row.querySelectorAll('td')[2].innerText
                    })
                    //   var name = row.querySelectorAll('.pn')[0].innerText;
                    //   var reason = row.querySelectorAll('.reason > span')[0].getAttribute('title');
                    //   var status = row.querySelectorAll('td')[2]
                }

                rows = $('div#preview-team-news > .home > .note.rc-b > ul.items > li');
                var homeNews = [];
                for (var i = 0, row; row = rows[i]; i++) {
                    homeNews.push({ text: row.innerText });
                }
                rows = $('div#preview-team-news > .away > .note.rc-b > ul.items > li');
                var awayNews = [];
                for (var i = 0, row; row = rows[i]; i++) {
                    awayNews.push({ text: row.innerText });
                }


                var data = {
                    homeTeam: $('div.match-header > table > tbody > tr > td.team')[0].innerText,
                    awayTeam: $('div.match-header > table > tbody > tr > td.team')[1].innerText,
                    homeLineup: homeLineup,
                    awayLineup: awayLineup,
                    homeNews: homeNews,
                    awayNews: awayNews,
                    missingHomePlayers: missingHomePlayers,
                    missingAwayPlayers: missingAwayPlayers
                };
                return data
            })

        console.log(JSON.stringify(data));

    }



    return value;

}
