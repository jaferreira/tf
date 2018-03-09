var Nightmare = require('./nightmare');
var vo = require('vo');


vo(run)(function (err, result) {
    if (err) throw err;
});

function *run() {
    var team = {
        providers: [{
            link: 'asdasd',
            name: 'asdasd'
        }]
    }
    var nightmare = Nightmare({
        show: true,
        paths: {
            userData: '/dev/null'
        }
    });

    var title = yield nightmare
        .goto("https://www.sofascore.com/pt/time/futebol/west-bromwich-albion/8")
        
        .ewait("dom-ready")
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
        .then(function(items){
            console.log(JSON.stringify(items))
        })
    yield nightmare.end();

    console.log(title);
}