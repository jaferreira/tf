var Nightmare = require('nightmare');
var vo = require('vo');
function* Status() {
    console.log('hey')
    var scraper = new Nightmare({
        switches: {
            'ignore-certificate-errors': true,
            'lang': 'en-EN'
        },
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
    var value = yield scraper
        .goto('https://www.whoscored.com/Teams/31/Show/England-Everton')

        .wait('table#team-fixtures-summary')
        .evaluate(function (team) {


            var rows = $('table#team-fixtures-summary > tbody > tr');
            var link = '';
            var home = '';
            var away = '';
            for (var i = 0, row; row = rows[i]; i++) {
                home = row.querySelectorAll('td.team.home')[0].innerText;
                away = row.querySelectorAll('td.team.away')[0].innerText;
                if ((row.querySelectorAll('td.toolbar.right')[0].innerText == 'Preview') && (home == 'Stoke' && away == 'Everton')) {
                    link = row.querySelectorAll('td.toolbar.right > a')[0].getAttribute('href');
                    break;
                }
                else {
                    home = '';
                    away = '';
                }
            }



            var result = {
                home: home,
                away: away,
                link: link
            }


            return result

        }, team)

        // .then(function* (items) {
        //     console.log(JSON.stringify(items))
        //     return yield items;
        //     if(link.length > 0)
        //     {
        //         // return yield
        //     }
        // })

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


        })
    console.log(value.link.length)
    if (value.link.length > 0) {
        console.log('value')
        var data = yield scraper
            .goto('https://www.whoscored.com' + value.link)
            .wait('.pitch')
            .evaluate(function () {

                var homeSquad = $('div.pitch > .home > ul')
                var homeLineup = [];
                var awayLineup = [];
                for (var i = 0, row; row = homeSquad[i]; i++) {
                    var playerData = $('div.pitch > .home > ul')[3].getAttribute('title').split('(');
                    
                    homeLineup.push({
                        top: row.style.top,
                        left: row.style.left,
                        right: row.style.right,
                        name: playerData[0], //row.querySelectorAll('.player-name-wrapper')[0].innerText
                        position: playerData[0].replace(')', '')
                    })
                }

                var awaySquad = $('div.pitch > .away > ul')
                for (var i = 0, row; row = awaySquad[i]; i++) {
                    awayLineup.push({
                        top: row.style.top,
                        left: row.style.left,
                        right: row.style.right,
                        name: row.querySelectorAll('.player-name-wrapper')[0].innerText
                    })
                }
                var rows = $('div#missing-players > .home > table > tbody tr')
                var missingHomePlayers = [];

                for (var i = 0, row; row = rows[i]; i++) {
                    missingHomePlayers.push({
                        name: row.querySelectorAll('.pn')[0].innerText,
                        reason: row.querySelectorAll('.reason > span')[0].getAttribute('title'),
                        status: row.querySelectorAll('td')[2].innerText
                    })
                }
                rows = $('div#missing-players > .away > table > tbody tr')
                var missingAwayPlayers = [];
                for (var i = 0, row; row = rows[i]; i++) {
                    missingAwayPlayers.push({
                        name: row.querySelectorAll('.pn')[0].innerText,
                        reason: row.querySelectorAll('.reason > span')[0].getAttribute('title'),
                        status: row.querySelectorAll('td')[2].innerText
                    })
                    //   var name = row.querySelectorAll('.pn')[0].innerText;
                    //   var reason = row.querySelectorAll('.reason > span')[0].getAttribute('title');
                    //   var status = row.querySelectorAll('td')[2]
                }

                rows = $('div#preview-team-news > .home > .note.rc-b > ul.items > li');
                var homeNews = [];
                for (var i = 0, row; row = rows[i]; i++) {
                    homeNews.push({text: row.innerText});
                }
                rows = $('div#preview-team-news > .away > .note.rc-b > ul.items > li');
                var awayNews = [];
                for (var i = 0, row; row = rows[i]; i++) {
                    awayNews.push({text:row.innerText});
                }


                var data = {
                    homeTeam: $('div.match-header > table > tbody > tr > td.team')[0].innerText,
                    awayTeam: $('div.match-header > table > tbody > tr > td.team')[1].innerText,
                    homeLineup: homeLineup,
                    awayLineup: awayLineup,
                    homeNews : homeNews,
                    awayNews :awayNews , 
                    missingHomePlayers: missingHomePlayers,
                    missingAwayPlayers: missingAwayPlayers
                };
                return data
            })





        console.log(JSON.stringify(data));

    }
}



vo(Status)(function (err, titles) {



});