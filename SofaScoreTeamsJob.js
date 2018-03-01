var nightmare = require('nightmare');

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
        .evaluate(function () {

            var nameTeam = $('h2.page-title')[0].innerText.trim();
            var rows = $('.top-scorers-container')[0].querySelectorAll('a');
            var topScores = [];
            for (var i = 0, row; row = rows[i]; i++) {

                topScores.push({
                    position : row.querySelectorAll('.cell__content')[0].innerText.trim(),
                    name : row.querySelectorAll('.cell__content')[2].innerText.trim(),
                    matches : row.querySelectorAll('.cell__content')[3].innerText.trim(),
                    goals : row.querySelectorAll('.cell__content')[4].innerText.trim(),
                    ratings : row.querySelectorAll('.cell__content')[5].innerText.trim()
                });


            }
            return topScores

        })



    return value;

}
