var Nightmare = require('nightmare');
var vo = require('vo');
function Status() {
    var scraper = new Nightmare({
        show: false, webPreferences: {
            images: false
        }
    });

    scraper
        .goto('https://www.onlinebettingacademy.com/stats/basketball/match/denver-nuggets-vs-san-antonio-spurs/244809/stats')

        .evaluate(function () {
            var items = [];

            var principalHomeTeam = $('td.stats-game-head-teamname.hide-mobile')[0].innerText;
            var principalAwayTeam = $('td.stats-game-head-teamname.hide-mobile')[1].innerText;




            var lastGamesBetweenTeams = [];

            var rows = $('table.data-table.hastoptitle > tbody > tr');


            for (var i = 0, row; row = rows[i]; i++) {

                var info = row.querySelectorAll('td');

                var infoawayTeam = info[4].innerText;
                var infoscore = info[3].innerText.split(' - ');
                var infoawayTeamScore = Number(infoscore[0]);
                var infohomeTeamScore = Number(infoscore[1]);
                var infohomeTeam = info[2].innerText;


                var gameInfo = {
                    awayTeam: infoawayTeam,
                    awayTeamScore: infoawayTeamScore,
                    homeTeamScore: infohomeTeamScore,
                    homeTeam: infohomeTeam
                }
                lastGamesBetweenTeams.push(gameInfo);

            }



            var lastHomeTeamGames = [];
            rows = $('table.data-table.hastotitle > tbody > tr');

            for (var i = 0, row; row = rows[i]; i++) {

                var info = row.querySelectorAll('td');

                var infoawayTeam = info[3].innerText;
                var infoscore = info[2].innerText.split(' - ');
                var infoawayTeamScore = Number(infoscore[0]);
                var infohomeTeamScore = Number(infoscore[1]);
                var infohomeTeam = info[1].innerText;


                var gameInfo = {
                    awayTeam: infoawayTeam,
                    awayTeamScore: infoawayTeamScore,
                    homeTeamScore: infohomeTeamScore,
                    homeTeam: infohomeTeam
                }
                lastHomeTeamGames.push(gameInfo);

            }

            var lastAwayTeamGames = [];
            rows = $('table.data-table  ')[2].querySelectorAll(' tbody > tr')

            for (var i = 0, row; row = rows[i]; i++) {

                var info = row.querySelectorAll('td');

                var infoawayTeam = info[3].innerText;
                var infoscore = info[2].innerText.split(' - ');
                var infoawayTeamScore = Number(infoscore[0]);
                var infohomeTeamScore = Number(infoscore[1]);
                var infohomeTeam = info[1].innerText;


                var gameInfo = {
                    awayTeam: infoawayTeam,
                    awayTeamScore: infoawayTeamScore,
                    homeTeamScore: infohomeTeamScore,
                    homeTeam: infohomeTeam
                }
                lastAwayTeamGames.push(gameInfo);

            }

            var items = {
                home: principalHomeTeam,
                away: principalAwayTeam,
                lastGamesBetweenTeams: lastGamesBetweenTeams,
                lastHomeTeamGames: lastHomeTeamGames,
                lastAwayTeamGames: lastAwayTeamGames
            }


            return items;

        }) 
 

        .then(function (items) {
            console.log('hello then');
            // console.log(JSON.stringify(items));
            items.home = capitalize(items.home);
            items.away =  capitalize(items.away);
        
            console.log('----------------------');
            GetStatsFromData(items.home, items.lastGamesBetweenTeams);
            console.log('----------------------------------HOMES GAMES DATA------------------------------')
            GetStatsFromData(items.home, items.lastHomeTeamGames);
            console.log('----------------------------------AWAY GAMES DATA------------------------------')
            GetStatsFromData(items.away, items.lastAwayTeamGames);

            return items;
        })

}

function capitalize(s){
   var result =  s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
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