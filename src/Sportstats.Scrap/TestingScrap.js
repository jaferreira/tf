var Nightmare = require('nightmare');
var vo = require('vo');
function Status() {
    console.log('hey')
    var scraper = new Nightmare({
        switches: { 'ignore-certificate-errors': true,
    'lang' : 'en-EN' },
        show: false, webPreferences: {
            images: true
        }, openDevTools: { mode: 'detach' }
    });

    var team = {
        providers: [{
            link: 'asdasd',
            name: 'asdasd'
        }]
    }
    return scraper
        .goto('https://www.sofascore.com/team/football/manchester-city/17')

        .wait('.squad')
        .evaluate(function (team) {
            
            var t = document.querySelectorAll('h2.page-title')[0];
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
                squad.push({
                    name: row.querySelectorAll('.squad-player__name')[0].innerText.trim(),
                    nationality: row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[1] ? row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[1].innerText.trim() : '',
                    position: row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[0] ? row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[0].innerText.trim() : '',
                    number: row.querySelectorAll('span.squad-player__shirt-number.theme-background-color')[0] ? row.querySelectorAll('span.squad-player__shirt-number.theme-background-color')[0].innerText.trim() : ''

                })

            }

            rows = $('table.table.table--justified > tbody > tr ');

            var findElements = 0;
            var manager = '';
            var stadium = '';
            var capacity = '';
            var city = '';

            for (var i = 0, row; row = rows[i]; i++) {

                console.log(i)
                if (row.innerText.startsWith('Manager') == true) {
                    console.log('1')
                    manager = row.innerText.split('Manager').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('Stadium') == true) {
                    console.log('2')
                    stadium = row.innerText.split('Stadium').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('Capacity') == true) {
                    console.log('3')
                    capacity = row.innerText.split('Capacity').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('City') == true) {
                    console.log('4')
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

        .then(function (items) {
         console.log(JSON.stringify(items))
        })

        .catch(error => {
            console.log('fuck')
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
            retry(scraper);

        }
        )




}
function retry(nightmare) {
    return nightmare
        .goto('https://www.sofascore.com/team/football/manchester-city/17')

        .wait('.tournament-event-list-wrapper')
        .evaluate(function (team) {
            var t = document.querySelectorAll('h2.page-title')[0];
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
                squad.push({
                    name: row.querySelectorAll('.squad-player__name')[0].innerText.trim(),
                    nationality: row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[1] ? row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[1].innerText.trim() : '',
                    position: row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[0] ? row.querySelectorAll('.squad-player__info.u-t2 > .cell.cell--justified > div > div.cell__content')[0].innerText.trim() : '',
                    number: row.querySelectorAll('span.squad-player__shirt-number.theme-background-color')[0] ? row.querySelectorAll('span.squad-player__shirt-number.theme-background-color')[0].innerText.trim() : ''

                })

            }

            rows = $('table.table.table--justified > tbody > tr ');

            var findElements = 0;
            var manager = '';
            var stadium = '';
            var capacity = '';
            var city = '';

            for (var i = 0, row; row = rows[i]; i++) {

                console.log(i)
                if (row.innerText.startsWith('Manager') == true) {
                    console.log('1')
                    manager = row.innerText.split('Manager').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('Stadium') == true) {
                    console.log('2')
                    stadium = row.innerText.split('Stadium').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('Capacity') == true) {
                    console.log('3')
                    capacity = row.innerText.split('Capacity').join('').trim();
                    findElements++;
                }
                else if (row.innerText.startsWith('City') == true) {
                    console.log('4')
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

        .then(function (items) {
            console.log(JSON.stringify(items))
        })
}
function log(item) {
    console.log(item)
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