var Nightmare = require('nightmare'),
    request = require('request'),
    vo = require('vo'),
    tryCount = 0;
process.on('unhandledRejection', (reason, p) => {
    if (tryCount <= 5) {
        console.log('retry - ' + tryCount)
        tryCount++;
        Status();
    }
    else {
        //TODO reporting error
    }
});

function Status() {
    var scraper = new Nightmare({

        show: true,
        webPreferences: {

            images: true
        }
    });

    scraper

        .goto('https://www.sofascore.com/tournament/football/italy/serie-a/23')
        .wait('.js-event-list-tournament-events')
        .click('label.js-tournament-page-events-select-round.radio-switch__item')
        .evaluate(function () {
            var items = [];


            var rows = $('.tab-pane.active > .standings-table > .cell.cell--standings');
            //GET STANDINGS
            for (var i = 0, row; row = rows[i]; i++) {
                var data = row.querySelectorAll('div');

                var position = data[0].innerText.trim();

                var teamName = row.querySelectorAll('.cell__content.standings__team-name')[0].innerText;
                var link = row.querySelectorAll('.cell__content.standings__team-name > a.js-link')[0].href;
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
                    teamLink: link,
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

                topScores.push({
                    position: row.querySelectorAll('div')[0].innerText.trim(),
                    name: row.querySelectorAll('div')[5].innerText.trim(),

                    team: row.querySelectorAll('div')[6].innerText.trim(),
                    matches: row.querySelectorAll('div')[7].innerText.trim(),
                    goals: row.querySelectorAll('div')[9].innerText.trim(),
                    rating: row.querySelectorAll('div')[11].innerText.trim()
                })
            }

            var newcomers = [];
            rows = $('div.bg-container > a.cell.cell--interactive.u-mB4.js-link > .cell__section--main.u-mL12');
            for (var i = 0, row; row = rows[i]; i++) {
                newcomers.push(row.innerText.trim())
            }

            var factsLeague = $('table.table.table--justified > tbody > tr > td.ff-medium');
            var leagueData = {
                standings: items,
                topScores: topScores,
                name: $('h2.page-title')[0].innerText.trim(),
                permalink: $('h2.page-title')[0].innerText.split(' ').join(''),
                titleHolder: $('a.cell__section--main.u-flex-halves.u-br.u-p4.hover-link-block.js-link')[0].innerText.trim().split(/\r?\n/)[0],
                mostTitles: $('a.cell__section--main.u-flex-halves.u-br.u-p4.hover-link-block.js-link')[1].innerText.trim().split(/\r?\n/)[0],
                mostTitlesNumber: $('a.cell__section--main.u-flex-halves.u-br.u-p4.hover-link-block.js-link')[1].innerText.trim().split(/\r?\n/)[1].split('(')[1].replace(')', ''),
                newcomers: newcomers,
                facts: {
                    devisionLevel: factsLeague[0].innerText.trim(),
                    numberRounds: factsLeague[1].innerText.trim(),
                    averageGoals: factsLeague[2].innerText.trim(),
                    homeTeamWins: factsLeague[3].innerText.trim(),
                    draws: factsLeague[4].innerText.trim(),
                    awayTeamWins: factsLeague[5].innerText.trim(),
                    yellowCards: factsLeague[6].innerText.trim(),
                    redCards: factsLeague[7].innerText.trim(),

                }
            }

            return leagueData;

        })
        .end()

        .then(function (items) {
            request({
                url: 'http://wigserver.myvnc.com:3000/scrap/leagues/' + items.permalink,
                method: 'POST',
                json: items
              }, function(error, response, body){
                console.log(body);
              });


            return items;
        })



}

function capitalize(s) {
    var result = s.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase(); });
    console.log(result);
    return result;
};

function GetStatsFromData(teamToStats, gamesToStats) {
    var homeScored = 0;
    var awayScored = 0;
    var homeVictory = 0;
    var awayVictory = 0;
    var homeScoredAsHome = 0;
    var homeVictoryAsHome = 0;
    var awayVictoryAsAway = 0;
    var awayScoredAsAway = 0;
    gamesToStats.forEach(function (element) {
        //console.log(JSON.stringify(element));
        var isSameHomeTeam = false;

        if (element.homeTeam.trim() == teamToStats.trim())
            isSameHomeTeam = true

        if (isSameHomeTeam) {

            homeScored += element.homeTeamScore;
            awayScored += element.awayTeamScore;


            homeScoredAsHome += element.homeTeamScore;
            awayScoredAsAway += element.awayTeamScore;

            //para outros desportos testar empates .....
            if (element.homeTeamScore > element.awayTeamScore) {
                homeVictory++;
                homeVictoryAsHome++;
            }

            else {
                awayVictory++;
                awayVictoryAsAway++;
            }
        }
        else {

            awayScored += element.homeTeamScore;
            homeScored += element.awayTeamScore;
            //para outros desportos testar empates .....
            if (element.homeTeamScore > element.awayTeamScore)
                awayVictory++;
            else
                homeVictory++;
        }

    }, this);
    // console.log('Hoje ' + items.home + ' vs ' + items.away);
    console.log('Nos últimos ' + gamesToStats.length + ' jogos');
    console.log('Home Scored ' + homeScored);
    console.log('Away Scored ' + awayScored);
    console.log('Home Avrg Scored ' + (homeScored / gamesToStats.length))
    console.log('Away Avrg Scored ' + (awayScored / gamesToStats.length))






    console.log('Home Avrg Scored as Home ' + (Math.round((homeScoredAsHome / (homeVictoryAsHome + awayVictoryAsAway)).toFixed(2))));
    console.log('Away Avrg Scored as Away ' + (Math.round((awayScoredAsAway / (homeVictoryAsHome + awayVictoryAsAway)).toFixed(2))));
    console.log('Home Victorys as Home Team ' + homeVictoryAsHome);
    console.log('Away Victorys as Away Team ' + awayVictoryAsAway);
    console.log('Home % Victory ' + (Math.round((homeVictory * 100) / (homeVictory + awayVictory)).toFixed(2) + '%'));
    console.log('Away % Victory ' + (Math.round((awayVictory * 100) / (awayVictory + homeVictory)).toFixed(2) + '%'));

    console.log('Home % Victory as Home ' + (Math.round((homeVictoryAsHome * 100) / (homeVictoryAsHome + awayVictoryAsAway)).toFixed(2)) + '%');
    console.log('Away % Victory  as Away ' + (Math.round((awayVictoryAsAway * 100) / (awayVictoryAsAway + homeVictoryAsHome)).toFixed(2)) + '%');

    console.log('Home Victory ' + homeVictory);
    console.log('Away Victory ' + awayVictory);
    // console.log(JSON.stringify(items))
}

vo(Status)(function (err, titles) {


    console.log('hello');
});