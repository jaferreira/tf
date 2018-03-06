'use strict';
module.exports = function (app) {

    // Teams
    var teamsScrapController = require('../Controllers/TeamsScrapController');

    app.route('/scrap/teams/pending')
        .get(teamsScrapController.get_pending_teams_to_scrap);
    
    app.route('/scrap/teams/:team')
        .post(teamsScrapController.save_team_scrap_info);
    


    // Leagues
    var leaguesScrapController = require('../Controllers/LeaguesScrapController');

    app.route('/scrap/leagues/pending')
        .get(leaguesScrapController.get_pending_leagues_to_scrap);
    // app.route('/scrap/leagues/save')
    //     .post(leaguesScrapController.save_scrap_result);
    app.route('/scrap/leagues')
        .post(leaguesScrapController.create_league_to_scrap);
    
    app.route('/scrap/leagues/:league')
        .post(leaguesScrapController.save_league_scrap_info);
    
};