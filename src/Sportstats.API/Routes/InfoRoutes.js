'use strict';
module.exports = function (app) {

    // League Info
    var leagueInfoController = require('../Controllers/LeagueInfoController');

     /**
     * @swagger
     * /info/leagues:
     *   get:
     *     description: Re that are pending to be scraped.
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
    app.route('/info/leagues/')
        .post(leagueInfoController.create_league_info);

    /**
     * @swagger
     * /info/countries:
     *   get:
     *     description: Returns the league information for the permalink passed.
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: league
     *         type: string
     *         in: path
     *         required: true
     *         description: permalink of the league.
     *     responses:
     *       200:
     *         description: leagues
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/LegueInfo'
     */
    app.route('/info/leagues/:league')
        .get(leagueInfoController.get_league_info);
    
    /**
     * @swagger
     * /info/countries:
     *   get:
     *     description: Returns all countries.
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: countries
     */
    app.route('/info/countries')
        .get(leagueInfoController.get_countries);

     /**
     * @swagger
     * /info/countries:
     *   get:
     *     description: Returns all leagues from a country.
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: country
     *         type: string
     *         in: path
     *         required: true
     *         description: Country name.
     *     responses:
     *       200:
     *         description: leagues
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/LegueInfo'
     */
    app.route('/info/countries/:country')
        .get(leagueInfoController.get_leagues_from_country);
   
        
};