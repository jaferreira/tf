var nightmare = require('nightmare'),
    tryCount = 0,
    request = require('request');
process.on('unhandledRejection', (reason, p) => {
    console.log('erro')
    if (tryCount <= 5) {
        console.log('retry - ' + tryCount)
        tryCount++;
        run();
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

        console.log(JSON.stringify('done'));
        request.post({
            url: 'http://localhost:3000/scrap/teams/bulk/',
            json: true,
            body: results
        }, function (error, response, body) {
            console.log('API - ' + body)
        });

        nbot.end();
        nbot.proc.disconnect();
        nbot.proc.kill();
        nbot.ended = true;
        nbot = null;
        return nbot;
    }


}

function* running(teams) {

    var globalMaxRetries = 5;
    var results = [];
    var retries = [];

    // Initialize retry counters
    teams.forEach(league => {
        retries.push({
            permalink: league.permalink,
            maxRetries: globalMaxRetries,
            retryCount: 0
        });
    });

    for (i = 0; i < teams.length; i++) {
        console.log(' --- ');
        console.log('Running [' + (i + 1) + '] of ' + teams.length)
        console.log('[' + teams[i].name + '] Going to start scraping');

        var r = yield* scrapLeagueInfo(teams[i]);

        if (r != null) {
            console.log('[' + teams[i].name + '] Scraping done.');
            results.push(r);
        }
        else {
            console.log('[' + teams[i].name + '] Scraping error.');
            var retriesInfo = {};
            for (var j in retries) {
                if (retries[j].permalink == teams[i].permalink) {
                    retriesInfo = retries[j];
                    break;
                }
            }
            var retryCount = retriesInfo.retryCount;
            var maxRetries = retriesInfo.maxRetries;

            console.log('[' + teams[i].name + '] Retry information: RetryCount: ' + retryCount + ' (max: ' + maxRetries + ')');
            if (retriesInfo && retryCount <= maxRetries) {
                // update retry information
                for (var k in retries) {
                    if (retries[k].permalink == teams[i].permalink) {
                        retries[k].retryCount++;
                        break;
                    }
                }
                console.log('[' + teams[i].name + '] RetryCount (' + retryCount + ') less the max (' + maxRetries + '), trying one more time. Decremented i: ' + (i - 1));
                i--;
            }
            else {
                console.log('[' + teams[i].name + '] Max retries reached, going to next league (i: ' + i + ')');
            }
        }

    }
    console.log('finish')
    return yield results;

}

function* scrapLeagueInfo(team) {

    console.log('starting Scrap Url ' + team.providers[0].link);
    var value = yield nbot
        .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')

        .goto(team.providers[0].link)
        .wait(1000)
        .wait('.squad')
        .evaluate(function (team) {
            var nameTeam = $('h2.page-title')[0].innerText.trim();
            var rows = $('.top-scorers-container')[0].querySelectorAll('a');
            var topScores = [];
            for (var i = 0, row; row = rows[i]; i++) {
                console.log('hello 2 ');
                topScores.push({
                    position: row.querySelectorAll('.cell__content')[0].innerText.trim(),
                    name: row.querySelectorAll('.cell__content')[2].innerText.trim(),
                    matches: row.querySelectorAll('.cell__content')[3].innerText.trim(),
                    goals: row.querySelectorAll('.cell__content')[4].innerText.trim(),
                    ratings: row.querySelectorAll('.cell__content')[5].innerText.trim()
                });


            }

            rows = $('.squad > a');
            var squad = [];
            for (var i = 0, row; row = rows[i]; i++) {
                console.log('hello 4 ');
                squad.push({
                    name: row.querySelectorAll('.squad-player__name')[0].innerText.trim(),
                    nationality: row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[1].innerText.trim(),
                    position: row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[0].innerText.trim(),
                    number: row.querySelectorAll('span.squad-player__shirt-number.theme-background-color')[0].innerText.trim()

                })

            }

            rows = $('table.table.table--justified > tbody > tr ');

            var findElements = 0;
            var manager = '';
            var stadium = '';
            var capacity = '';
            var city = '';

            for (var i = 0, row; row = rows[i]; i++) {

                if (row.innerText.startsWith('Manager') == true) {
                    manager = row.innerText.split('Manager').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('Stadium') == true) {
                    stadium = row.innerText.split('Stadium').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('Capacity') == true) {
                    capacity = row.innerText.split('Capacity').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('City') == true) {
                    city = row.innerText.split('City').join('').trim();
                    findElements++;
                }
                if (findElements == 4)
                    break;

            }



            var result = {
                provider: team.providers[0],
                teamName: $('h2.page-title')[0].innerText,
                teamLink: team.providers[0].link,
                topScores: topScores,
                squad: squad,
                teamInfo: {
                    manager: manager,
                    stadium: stadium,
                    capacity: capacity,
                    city: city
                }
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

        }
        )



    return value;

}
