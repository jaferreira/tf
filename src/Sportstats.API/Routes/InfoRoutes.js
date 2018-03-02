'use strict';
module.exports = function (app) {

    // League Info
    var leagueInfoController = require('../Controllers/LeagueInfoController');

    app.route('/info/leagues/')
        .post(leagueInfoController.create_league_info);

    app.route('/info/leagues/:league')
        .get(leagueInfoController.get_league_info);
   
        
};