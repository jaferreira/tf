var Nightmare = require('./custom');
var vo = require('vo');
var nightmare;

vo(run)(function (err, result) {
    if (err) console.log(err);
});



function* run() {
    var team = {
        providers: [{
            link: 'asdasd',
            name: 'asdasd'
        }]
    }
     nightmare = Nightmare({
        show: true,
        width: 1920,
        height: 1080,
        waitTimeout: 100000,
        switches: {
            'ignore-certificate-errors': true
          }
        // paths: {
        //     userData: '/dev/null'
        // }
    });
    console.log('hello')
    var title = yield nightmare
        
        .goto("https://www.sofascore.com/team/football/west-bromwich-albion/8")
        .wait(1000)
        .wait('.squad')
        .evaluate(function (team) {
            //return document.querySelectorAll('h2.page-title')[0].innerText;
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


        .then(function (item) {
            console.log(item)
        })
    yield nightmare.end();

    console.log(title);
}