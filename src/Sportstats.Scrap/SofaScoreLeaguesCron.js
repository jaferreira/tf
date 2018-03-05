var cron = require('node-cron'),
    leaguesJob = require('./SofaScoreLeagues');

tryCount = 0;



process.on('unhandledRejection', (reason, p) => {
    if (tryCount <= 5) {
        console.log('retry - ' + tryCount)
        tryCount++;
        leaguesJob.scrapLeague();
    }
    else {
        //TODO reporting error
    }
});

cron.schedule('*/5 * * * *', function () {
    console.log('hey');
    leaguesJob.scrapLeague();
}, null, true);