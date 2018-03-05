var cron = require('node-cron'),
    leaguesJob = require('./SofaScoreLeagues');



cron.schedule('* 10 * * *', function () {
    console.log('hey');
    leaguesJob.scrapLeague(); 
}, null, true);