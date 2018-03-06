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
     */

    /**
     * @swagger
     * /scrap/leagues/pending:
     *   get:
     *     description: Returns leagues
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
     * /scrap/leagues/league:
     *   post:
     *     description: Save scraped league info (upsert)
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: league
     *         type: string
     *     responses:
     *       200:
     *         description: League
     *         schema:
     *             $ref: '#/definitions/LeagueInfo'
     */
    app.route('/scrap/leagues/:league')
        .post(leaguesScrapController.save_league_scrap_info);

};