'use strict';
module.exports = function (app) {

    // League Info
    var leagueInfoController = require('../Controllers/LeagueInfoController');

     
    app.route('/info/leagues/')
        .get(leagueInfoController.get_leagues);

    
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
     *         schema:
     *           type: array
     *           items: string
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
     */
    app.route('/info/countries/:country')
        .get(leagueInfoController.get_leagues_from_country);
   
        
};