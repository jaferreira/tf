'use strict';
module.exports = function (app) {

    // Teams
    var teamsScrapController = require('../Controllers/TeamsScrapController');

    // Get pending teams to be scraped
    app.route('/scrap/teams/pending')
        .get(teamsScrapController.get_pending_teams_to_scrap);
    
    // Create new team to be scraped
    app.route('/scrap/teams')
        .post(teamsScrapController.create_team_to_scrap);

    // Save scraped team info (upsert)
    app.route('/scrap/teams/:team')
        .post(teamsScrapController.save_team_scrap_info);
    


    // Leagues
    var leaguesScrapController = require('../Controllers/LeaguesScrapController');

    // Get pending leagues to be scraped
    app.route('/scrap/leagues/pending')
        .get(leaguesScrapController.get_pending_leagues_to_scrap);
        
    // Create new league to be scraped
    app.route('/scrap/leagues')
        .post(leaguesScrapController.create_league_to_scrap);
    
    // Save scraped league info (upsert)
    app.route('/scrap/leagues/:league')
        .post(leaguesScrapController.save_league_scrap_info);
    
};