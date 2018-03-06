'use strict';
module.exports = function (app) {

    // League Info
    var leagueInfoController = require('../Controllers/LeagueInfoController');

     /**
     * @swagger
     * /a_a/teams/pending:
     *   get:
     *     description: Get pending teams to be scraped
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
    app.route('/info/leagues/')
        .post(leagueInfoController.create_league_info);

    app.route('/info/leagues/:league')
        .get(leagueInfoController.get_league_info);
   
        
};