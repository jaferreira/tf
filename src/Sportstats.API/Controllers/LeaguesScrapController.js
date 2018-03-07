'use strict';

var logger = require('../Logger.js'),
    mongoose = require('mongoose'),
    Leagues = mongoose.model('Leagues'),
    LeaguesToScrap = mongoose.model('LeaguesToScrap'),
    TeamsToScrap = mongoose.model('TeamsToScrap'),
    async = require('async');



exports.get_pending_leagues_to_scrap = function (req, res) {

    var now = new Date();
    var filter = {
        nextScrapAt: { "$lte": now }
    };

    var options = {
        page: 1,
        limit: 10,
        sort: {
            createdAt: -1
        }
    };

    LeaguesToScrap.paginate(
        filter,
        options,
        function (err, house) {
            if (err) {
                logger.error(err);
                res.send(err);
            }
            res.json(house);
        });
};


exports.reset_leagues_to_scrap = function (req, res) {

    var now = new Date();
    LeaguesToScrap.update({ sport: 'football' }, { nextScrapAt: now }, { multi: true },
        function (err, num) {
            if (err) {
                logger.error(err);
                return res.sendStatus(500, {
                    error: err
                });
            }
            logger.info('Reset Next Scrap Date for ' + num + ' football leagues.');
            return res.sendStatus(200);
        });
};


exports.create_league_to_scrap = function (req, res) {
    var leagueInfo = req.body;

    var query = {
        'permalink': leagueInfo.permalink
    };

    if (!leagueInfo.nextScrapAt)
        leagueInfo.nextScrapAt = new Date();

    if (!leagueInfo.createdAt)
        leagueInfo.createdAt = new Date();

    LeaguesToScrap.findOneAndUpdate(query, leagueInfo, {
        upsert: true
    }, function (err, doc) {
        if (err) {
            logger.error(err);
            return res.sendStatus(500, {
                error: err
            });
        }
        logger.info('League to scrap succesfully saved: ' + leagueInfo.name);
        return res.json(doc);
    });
};



exports.save_league_scrap_info = function (req, res) {
    var leaguesData = req.body;

    try {
        logger.info('Saving ' + leaguesData + ' leagues:');
        leaguesData.forEach(league => {
            logger.info(' » (' + league.country + ') ' + league.name);
        });


        var nextScrapUpdateData = [];
        leaguesData.forEach(leagueInfo => {
            var providers = [];
            providers.push(leagueInfo.provider);
            nextScrapUpdateData.push({
                permalink: leagueInfo.permalink,
                nextScrapAt: leagueInfo.nextScrapAt,
                providers: providers
            });
            leagueInfo.provider = null;
        });
        logger.info('Updating ' + nextScrapUpdateData.length + ' leagues to scrap.');



        // Gather teams to scrap (in all the leagues)
        var teamsToScrap = [];
        leaguesData.forEach(leagueInfo => {
            if (leagueInfo.standings)
                leagueInfo.standings.forEach(standing => {
                    var newTeamToScrap = new TeamsToScrap();
                    newTeamToScrap.country = leagueInfo.country;
                    newTeamToScrap.league = leagueInfo.name;
                    newTeamToScrap.permalink = leagueInfo.permalink + '_' + standing.teamName.replace(/\s+/g, '');
                    newTeamToScrap.name = standing.teamName;
                    newTeamToScrap.providers = [];

                    newTeamToScrap.providers.push({
                        name: standing.providerInfo.name,
                        link: standing.providerInfo.link,
                    });

                    teamsToScrap.push(newTeamToScrap);
                    logger.debug(' » Set team ' + newTeamToScrap.name + ' (' + newTeamToScrap.country + ') to be scraped.');
                });
        });

        //Fields to match on for leagues upsert condition
        const matchFields = ['permalink'];

        //Perform bulk operation
        var result1 = TeamsToScrap.upsertMany(teamsToScrap, matchFields);
        logger.info('Updated ' + teamsToScrap.length + ' teams to be scraped.');

        // Updating League Info Data
        var result2 = Leagues.upsertMany(leaguesData, matchFields);
        logger.info('League info data succesfully saved for ' + leaguesData.length + ' teams.');


        var result3 = LeaguesToScrap.upsertMany(nextScrapUpdateData, matchFields);
        logger.info('Updated LeaguesToScrap info with nextScrapAt.');

        return res.sendStatus(200);
    } catch (err) {
        logger.error(err);
        return res.sendStatus(500, {
            error: err
        });
    }
};