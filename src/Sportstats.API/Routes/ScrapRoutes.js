'use strict';
module.exports = function (app) {

    // Teams
    var teamsScrapController = require('../Controllers/TeamsScrapController');
    // Leagues
    var leaguesScrapController = require('../Controllers/LeaguesScrapController');





   
    // app.route('/scrap/teams/pending')
    //     .get(teamsScrapController.get_pending_teams_to_scrap);

    // Create new team to be scraped
    // app.route('/scrap/teams')
    //     .post(teamsScrapController.create_team_to_scrap);

    
    // app.route('/scrap/teams/bulk')
    //     .post(teamsScrapController.save_team_scrap_info);


    
    // app.route('/scrap/leagues/pending')
    //     .get(leaguesScrapController.get_pending_leagues_to_scrap);

   
    // app.route('/scrap/leagues/reset')
    //     .get(leaguesScrapController.reset_leagues_to_scrap);

    
    // app.route('/scrap/leagues')
    //     .post(leaguesScrapController.create_league_to_scrap);

    
    // app.route('/scrap/leagues/bulk')
    //     .post(leaguesScrapController.save_league_scrap_info);
};