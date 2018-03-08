var nightmare = require('nightmare');
var tryCount = 0;
process.on('unhandledRejection', (reason, p) => {
    if (tryCount <= 5)
    {
        console.log('retry - ' + tryCount)
        tryCount++;
        run();
    }
    else
    {
        //TODO reporting error
    }
});
module.exports = {
    scrapTeams: function* run(linksToScrap) {
        nbot = nightmare({
            openDevTools: {
                mode: 'detach'
            },
            show: true
        });


        z = 0;
        results = yield* running(linksToScrap);
        return nbot;
    }


}

function* running(links) {


    var results = [];
    for (i = 0; i < links.length; i++) {
        console.log('teste')
        results.push(yield* scrapTeamInfo(links[i]));
    }
    console.log(JSON.stringify(results));
    //return results;

}

function* scrapTeamInfo(link) {


    var value = yield nbot
        .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
        .goto(link, { 'accept-language': 'en-US' })
        .wait('.squad')
        .evaluate(function (link) {
            console.log('hello ');
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

                console.log('hello 3 ');
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
                console.log('hello 5 ');
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
                teamName : $('h2.page-title')[0].innerText,
                teamLink : link,
                topScores: topScores,
                squad: squad,
                teamInfo : {
                    manager : manager,
                    stadium : stadium,
                    capacity : capacity,
                    city : city
                }
            }
       

            return result

        },link)
        .catch(error => {
            console.error('Search failed:', error)
          })


    return value;

}
