'use strict';
const settings = require('../settings');
const CountriesController = require('../Controllers/countriesController')

module.exports = function (app) {
    var countriesRoutePrefix = 'countries';
    let countriesCtrl = new CountriesController();


    /**
     * @swagger
     * /countries:
     *   get:
     *     tags:
     *       - "Countries"
     *     description: Returns a list of countries.
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: List of countries.
     * 
     */
    app.route(`/${settings.api.apiBasePath}/${countriesRoutePrefix}`)
        .get(countriesCtrl.get_countries);


    /**
     * @swagger
     * /countries/{country}/competitions:
     *   get:
     *     tags:
     *       - "Countries"
     *     description: Returns a list of competition for a country.
    *     parameters:
     *       - name: country
     *         type: string
     *         in: path
     *         required: true
     *         description: Country.
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: List of copetitions.
     * 
     */
    app.route(`/${settings.api.apiBasePath}/${countriesRoutePrefix}/:country/competitions`)
        .get(countriesCtrl.get_country_competitions);
};