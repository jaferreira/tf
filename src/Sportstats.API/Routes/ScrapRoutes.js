'use strict';
module.exports = function (app) {

    // Teams
    var teamsScrapController = require('../Controllers/TeamsScrapController');

   /**
     * @swagger
     * /scrap/teams/pending:
     *   get:
     *     description: Returns teams that are pending to be scraped.
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: teams
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/TeamToScrap'
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
     *     description: Save team scrap information for an array of teams. The ones that already exist, are updated. The key is the property 'permalink'.
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: teams
     *         type: array
     *         in: body
     *     responses:
     *       200
     */
    app.route('/scrap/teams/bulk')
        .post(teamsScrapController.save_team_scrap_info);



    // Leagues
    var leaguesScrapController = require('../Controllers/LeaguesScrapController');

    /**
     * @swagger
     * definitions:
     *   Provider:
     *     type: object
     *     required:
     *       - provider
     *       - link
     *     properties:
     *       - provider:
     *          type: string
     *       - link:
     *          type: string
     *   LeagueInfo:
     *     type: object
     *     required:
     *       - provider
     *       - link
     *     properties:
     *       - name:
     *          type: string
     *       - permalink:
     *          type: string
     *       - country:
     *          type: string
     *       - titleHolder:
     *          type: string
     *       - mostTitlesNumber:
     *          type: number
     *   LeagueToScrap:
     *     type: object
     *     required:
     *       - permalink
     *       - name
     *       - country
     *       - providers
     *     properties:
     *       permalink:
     *         type: string
     *       name:
     *         type: string
     *       country:
     *         type: string
     *       providers:
     *         type: array
     *         items:
     *             $ref: '#/definitions/Provider'
     * 
     *   TeamToScrap:
     *     type: object
     *     required:
     *       - permalink
     *       - name
     *       - country
     *       - providers
     *     properties:
     *       permalink:
     *         type: string
     *       name:
     *         type: string
     *       country:
     *         type: string
     *       providers:
     *         type: array
     *         items:
     *             $ref: '#/definitions/Provider'
     */

    /**
     * @swagger
     * /scrap/leagues/pending:
     *   get:
     *     description: Returns leagues that are pending to be scraped.
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: leagues
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/LeagueToScrap'
     */
    app.route('/scrap/leagues/pending')
        .get(leaguesScrapController.get_pending_leagues_to_scrap);

    /**
     * @swagger
     * /scrap/leagues/pending:
     *   get:
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
     *     description: Create new league to be scraped
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: leagueToScrap
     *         schema:
     *             $ref: '#/definitions/LeagueToScrap'
     */
    app.route('/scrap/leagues')
        .post(leaguesScrapController.create_league_to_scrap);

    /**
     * @swagger
     * /scrap/leagues/bulk:
     *   post:
     *     description: Save league scrap information for an array of leagues. The ones that already exist, are updated. The key is the property 'permalink'.
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: leagues
     *         type: array
     *         in: body
     *     responses:
     *       200
     */
    app.route('/scrap/leagues/bulk')
        .post(leaguesScrapController.save_league_scrap_info);
};