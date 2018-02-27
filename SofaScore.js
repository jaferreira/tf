var Nightmare = require('nightmare');
var vo = require('vo');
function Status() {
    var scraper = new Nightmare({
        
        show: true,
         webPreferences: {
             
            images: true
        }
    });

    scraper
  
        .goto('https://www.sofascore.com/tournament/football/portugal/primeira-liga/238',)

        .evaluate(function () {
            var items = [];


            var rows = $('.tab-pane.tab-event-standings-22181-overall > .standings-table > .cell.cell--standings');

            for (var i = 0, row; row = rows[i]; i++) {
                var data = row.querySelectorAll('div');

                var position = data[0].innerText.trim();
               
                var teamName = row.querySelectorAll('.cell__content.standings__team-name')[0].innerText;
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
                    position : position,
                    teamName : teamName,
                    gamesPlayed : played,
                    wins : win,
                    draws : draw,
                    defeateds : defeated,
                    goalScored : goalScored,
                    goalConceded : goalConceded,
                    lastResults : results,
                    points : points
                }

                items.push(data); 
                // items.push(teamName);
                

            }


            // var principalHomeTeam = $('td.stats-game-head-teamname.hide-mobile')[0].innerText;
            // var principalAwayTeam = $('td.stats-game-head-teamname.hide-mobile')[1].innerText;




            // var lastGamesBetweenTeams = [];

            // var rows = $('table.data-table.hastoptitle > tbody > tr');


            // for (var i = 0, row; row = rows[i]; i++) {

            //     var info = row.querySelectorAll('td');

            //     var infoawayTeam = info[4].innerText;
            //     var infoscore = info[3].innerText.split(' - ');
            //     var infoawayTeamScore = Number(infoscore[0]);
            //     var infohomeTeamScore = Number(infoscore[1]);
            //     var infohomeTeam = info[2].innerText;


            //     var gameInfo = {
            //         awayTeam: infoawayTeam,
            //         awayTeamScore: infoawayTeamScore,
            //         homeTeamScore: infohomeTeamScore,
            //         homeTeam: infohomeTeam
            //     }
            //     lastGamesBetweenTeams.push(gameInfo);

            // }



            // var lastHomeTeamGames = [];
            // rows = $('table.data-table.hastotitle > tbody > tr');

            // for (var i = 0, row; row = rows[i]; i++) {

            //     var info = row.querySelectorAll('td');

            //     var infoawayTeam = info[3].innerText;
            //     var infoscore = info[2].innerText.split(' - ');
            //     var infoawayTeamScore = Number(infoscore[0]);
            //     var infohomeTeamScore = Number(infoscore[1]);
            //     var infohomeTeam = info[1].innerText;


            //     var gameInfo = {
            //         awayTeam: infoawayTeam,
            //         awayTeamScore: infoawayTeamScore,
            //         homeTeamScore: infohomeTeamScore,
            //         homeTeam: infohomeTeam
            //     }
            //     lastHomeTeamGames.push(gameInfo);

            // }

            // var lastAwayTeamGames = [];
            // rows = $('table.data-table  ')[2].querySelectorAll(' tbody > tr')

            // for (var i = 0, row; row = rows[i]; i++) {

            //     var info = row.querySelectorAll('td');

            //     var infoawayTeam = info[3].innerText;
            //     var infoscore = info[2].innerText.split(' - ');
            //     var infoawayTeamScore = Number(infoscore[0]);
            //     var infohomeTeamScore = Number(infoscore[1]);
            //     var infohomeTeam = info[1].innerText;


            //     var gameInfo = {
            //         awayTeam: infoawayTeam,
            //         awayTeamScore: infoawayTeamScore,
            //         homeTeamScore: infohomeTeamScore,
            //         homeTeam: infohomeTeam
            //     }
            //     lastAwayTeamGames.push(gameInfo);

            // }

            // var items = {
            //     home: principalHomeTeam,
            //     away: principalAwayTeam,
            //     lastGamesBetweenTeams: lastGamesBetweenTeams,
            //     lastHomeTeamGames: lastHomeTeamGames,
            //     lastAwayTeamGames: lastAwayTeamGames
            // }


            return items;

        })


        .then(function (items) {

            console.log(JSON.stringify(items));
            // items.home = capitalize(items.home);
            // items.away =  capitalize(items.away);

            // console.log('----------------------');
            // GetStatsFromData(items.home, items.lastGamesBetweenTeams);
            // console.log('----------------------------------HOMES GAMES DATA------------------------------')
            // GetStatsFromData(items.home, items.lastHomeTeamGames);
            // console.log('----------------------------------AWAY GAMES DATA------------------------------')
            // GetStatsFromData(items.away, items.lastAwayTeamGames);

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