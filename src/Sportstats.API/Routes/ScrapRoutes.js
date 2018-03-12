'use strict';
module.exports = function (app) {

    // Teams
    var teamsScrapController = require('../Controllers/TeamsScrapController');
    // Leagues
    var leaguesScrapController = require('../Controllers/LeaguesScrapController');





    /**
      * @swagger
      * /scrap/teams/pending:
      *   get:
      *     tags:
      *       - "Teams"
      *     description: Returns teams that are pending to be scraped.
      *     produces:
      *      - application/json
      *     responses:
      *       200:
      *         description: teams
      *         schema:
      *           type: array
      */
    app.route('/scrap/teams/pending')
        .get(teamsScrapController.get_pending_teams_to_scrap);

    // Create new team to be scraped
    // app.route('/scrap/teams')
    //     .post(teamsScrapController.create_team_to_scrap);

    /**
     * @swagger
     * /scrap/teams/bulk:
     *   post:
     *     tags:
     *       - "Teams"
     *     description: Save team scrap information for an array of teams. The ones that already exist, are updated. The key is the property 'permalink'.
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: teams
     *         type: array
     *         in: body
     *         required: true
     *         description: Teams info to be saved.
     *     responses:
     *       200
     */
    app.route('/scrap/teams/bulk')
        .post(teamsScrapController.save_team_scrap_info);







    /**
     * @swagger
     * /scrap/leagues/pending:
     *   get:
     *     tags:
     *       - "Leagues"
     *     description: Returns leagues that are pending to be scraped.
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: leagues
     *         schema:
     *           type: array
     */
    app.route('/scrap/leagues/pending')
        .get(leaguesScrapController.get_pending_leagues_to_scrap);

    /**
     * @swagger
     * /scrap/leagues/pending:
     *   get:
     *     tags:
     *       - "Leagues"
     *     description: Reset the next scrap date for all the leagues, they will all stay pending for scrap.
     *     produces:
     *      - application/json
     *     responses:
     *       200
     */
    app.route('/scrap/leagues/reset')
        .get(leaguesScrapController.reset_leagues_to_scrap);

    /**
     * @swagger
     * /scrap/leagues:
     *   post:
     *     tags:
     *       - "Leagues"
     *     description: Create new league to be scraped
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: leagueToScrap
     */
    app.route('/scrap/leagues')
        .post(leaguesScrapController.create_league_to_scrap);

    /**
     * @swagger
     * /scrap/leagues/bulk:
     *   post:
     *     tags:
     *       - "Leagues"
     *     description: Save league scrap information for an array of leagues. The ones that already exist, are updated. The key is the property 'permalink'.
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: leagues
     *         type: array
     *         in: body
     *         required: true
     *         description: Leagues info to be saved.
     *     responses:
     *       200
     */
    app.route('/scrap/leagues/bulk')
        .post(leaguesScrapController.save_league_scrap_info);
};