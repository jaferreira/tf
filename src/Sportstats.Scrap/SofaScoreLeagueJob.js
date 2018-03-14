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
    scrapLeagues: function* run(leaguesToScrap) {
        nbot = nightmare({
            switches: { 'ignore-certificate-errors': true },
            show: false
        });

        console.log('start')
        z = 0;
        results = yield* running(leaguesToScrap);
        //console.log(JSON.stringify(results))

        console.log(JSON.stringify('done'));
        request.post({
            url: 'http://wigserver.myvnc.com:3000/scrap/leagues/bulk/',
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

function* running(leagues) {

    var globalMaxRetries = 5;
    var results = [];
    var retries = [];

    // Initialize retry counters
    leagues.forEach(league => {
        retries.push({
            permalink: league.permalink,
            maxRetries: globalMaxRetries,
            retryCount: 0
        });
    });

    for (i = 0; i < leagues.length; i++) {
        console.log(' --- ');
        console.log('Running [' + (i + 1) + '] of ' + leagues.length)
        console.log('[' + leagues[i].name + '] Going to start scraping');

        var r = yield* scrapLeagueInfo(leagues[i]);

        if (r != null) {
            console.log('[' + leagues[i].name + '] Scraping done.');
            results.push(r);
        }
        else {
            console.log('[' + leagues[i].name + '] Scraping error.');
            var retriesInfo = {};
            for (var j in retries) {
                if (retries[j].permalink == leagues[i].permalink) {
                    retriesInfo = retries[j];
                    break;
                }
            }
            var retryCount = retriesInfo.retryCount;
            var maxRetries = retriesInfo.maxRetries;

            console.log('[' + leagues[i].name + '] Retry information: RetryCount: ' + retryCount + ' (max: ' + maxRetries + ')');
            if (retriesInfo && retryCount <= maxRetries) {
                // update retry information
                for (var k in retries) {
                    if (retries[k].permalink == leagues[i].permalink) {
                        retries[k].retryCount++;
                        break;
                    }
                }
                console.log('[' + leagues[i].name + '] RetryCount (' + retryCount + ') less the max (' + maxRetries + '), trying one more time. Decremented i: ' + (i - 1));
                i--;
            }
            else {
                console.log('[' + leagues[i].name + '] Max retries reached, going to next league (i: ' + i + ')');
            }
        }

    }
    console.log('finish')
    return yield results;

}

function* scrapLeagueInfo(league) {

    console.log('starting Scrap Url ' + league.providers[0].link);
    var value = yield nbot
        .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')

        .goto(league.providers[0].link)
        .wait(1000)
        .wait('.js-event-list-tournament-events')
        .click('label.js-tournament-page-events-select-round.radio-switch__item')
        .evaluate(function (league) {
            var items = [];


            var rows = $('.tab-pane.active > .standings-table > .cell.cell--standings');
            //GET STANDINGS
            for (var i = 0, row; row = rows[i]; i++) {
                var data = row.querySelectorAll('div');

                var position = data[0].innerText.trim();

                var teamName = row.querySelectorAll('.cell__content.standings__team-name')[0].innerText;

                var provider = {
                    name: 'SofaScore',
                    link: row.querySelectorAll('.cell__content.standings__team-name > a.js-link')[0].href
                };


                var gameInfo = row.querySelectorAll('.cell__content.standings__data.standings__columns-32 > span');
                var played = gameInfo[0].innerText;
                var win = gameInfo[1].innerText;
                var draw = gameInfo[2].innerText;
                var defeated = gameInfo[3].innerText;
                var goals = gameInfo[4].innerText.split(':');
                var goalScored = goals[0];
                var goalConceded = goals[1];

                var results = [];
                var lastResults = row.querySelectorAll('.cell__section.standings__last-5.switch-content.js-standings-view-form > div > a > span');
                for (var x = 0, result; result = lastResults[x]; x++) {
                    var className = result.className;
                    if (className.indexOf('win') != -1)
                        results.push('W');
                    else if (className.indexOf('lose') != -1)
                        results.push('L');
                    else if (className.indexOf('draw') != -1)
                        results.push('D');
                }
                var points = row.querySelectorAll('.cell__section.standings__points')[0].innerText.trim();

                var data = {
                    position: position,
                    teamName: teamName,
                    providerInfo: provider,
                    gamesPlayed: played,
                    wins: win,
                    draws: draw,
                    defeateds: defeated,
                    goalScored: goalScored,
                    goalConceded: goalConceded,
                    lastResults: results,
                    points: points
                }

                items.push(data);
                // items.push(teamName);


            }
            var topScores = [];
            //GET TOP SCORES
            rows = $('.bg-container > a.cell.cell--interactive.u-mB4.js-link.js-show-player-details');
            for (var i = 0, row; row = rows[i]; i++) {
                var divs = row.querySelectorAll('div');
                topScores.push({
                    position: divs[0].innerText.trim(),
                    name: divs[5].innerText.trim(),

                    team: divs[6].innerText.trim(),
                    matches: divs[7].innerText.trim(),
                    goals: divs[9].innerText.trim(),
                    rating: (divs.length > 12) ? divs[11].innerText.trim() : null
                })
            }

            var newcomers = [];
            rows = $('div.bg-container > a.cell.cell--interactive.u-mB4.js-link > .cell__section--main.u-mL12');
            if (rows.length > 0)
                for (var i = 0, row; row = rows[i]; i++) {
                    newcomers.push(row.innerText.trim())
                }
            //2018-03-06 18:33:53.384

            rows = $('.js-event-list-tournament.tournament > .js-event-list-tournament-events > a');
            //[0].innerText.split('\n').length
            var nextGame = '';

            for (var i = 0, row; row = rows[i]; i++) {
                var time = new Date(row.getAttribute('data-start-timestamp') * 1000);
                if (time.getTime() > new Date().getTime()) {
                    time.setMinutes(time.getMinutes() + 110)//change league.getTime()
                    nextGame = time;
                    break;
                }
            }

            var factsLeague = $('table.table.table--justified > tbody > tr > td.ff-medium');
            var titleHolderSelector = $('a.cell__section--main.u-flex-halves.u-br.u-p4.hover-link-block.js-link');
            var leagueData = {
                provider: league.providers[0],
                standings: items,
                topScores: topScores,
                name: $('h2.page-title')[0].innerText.trim(),

                permalink: league.permalink,
                country: league.country,
                nextScrapAt: nextGame,



                titleHolder: titleHolderSelector[0].innerText.trim().split(/\r?\n/)[0],

                //TODO REFACTORING CHAMPIONCHIP EXAMPLE
                mostTitles: [{
                    name: (titleHolderSelector.length > 1) ? titleHolderSelector[1].innerText.trim().split(/\r?\n/)[0] : titleHolderSelector[0].innerText.trim().split(/\r?\n/)[0],
                    titles:  (titleHolderSelector.length > 1) ? titleHolderSelector[1].innerText.trim().split(/\r?\n/)[1].split('(')[1].replace(')', '') : 0
                }],

                newcomers: newcomers,
                facts: {
                    devisionLevel: (factsLeague.length >= 1) ? factsLeague[0].innerText.trim() : null,
                    numberRounds: (factsLeague.length >= 2) ? factsLeague[1].innerText.trim() : null,
                    averageGoals: (factsLeague.length >= 3) ? factsLeague[2].innerText.trim() : null,
                    homeTeamWins: (factsLeague.length >= 4) ? factsLeague[3].innerText.trim() : null,
                    draws: (factsLeague.length >= 5) ? factsLeague[4].innerText.trim() : null,
                    awayTeamWins: (factsLeague.length >= 6) ? factsLeague[5].innerText.trim() : null,
                    yellowCards: (factsLeague.length >= 7) ? factsLeague[6].innerText.trim() : null,
                    redCards: (factsLeague.length >= 8) ? factsLeague[7].innerText.trim() : null,

                }
            }

            return leagueData;

        }, league)

        // .then(function (leagueData) {
        //     console.log('done')
        //     request.post({
        //         url: 'http://localhost:3000/scrap/Leagues/' + leagueData.permalink,
        //         json: true,
        //         body: leagueData
        //     }, function (error, response, body) {
        //         console.log(response)
        //     });
        // })

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
            //console.error({ "status": "error", "message": message });
            // console.log('erro')

        }
        )



    return value;

}
