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
    var leagueInfo = req.body;
    var leagueName = req.params.league;
    var nextScrapDate = req.body.nextScrapDate;

    var query = {
        'permalink': leagueName
    };

    Leagues.findOneAndUpdate(query, leagueInfo, {
        upsert: true
    }, function (err, doc) {
        if (err) {
            logger.error(err);
            return res.sendStatus(500, {
                error: err
            });
        }
        logger.info('League info succesfully saved: ' + leagueName);
        logger.info('Updating LeaguesToScrap info for: ' + leagueName + ' (nextScrapAt: ' + nextScrapDate + ')');

        LeaguesToScrap.findOneAndUpdate(query, { nextScrapAt: nextScrapDate }, {
            upsert: true,
            new: true
        }, function (err, doc) {
            if (err) {
                logger.error(err);
                return res.sendStatus(500, {
                    error: err
                });
            }
            logger.info('Updated Succesfuly LeaguesToScrap info for: ' + leagueName);


            //Large amount of items
            var items = [];
            leagueInfo.standings.forEach(standing => {
                var newTeamToScrap = new TeamsToScrap();
                newTeamToScrap.country = leagueInfo.country;
                newTeamToScrap.league = leagueInfo.name;
                newTeamToScrap.permalink = leagueInfo.permalink + '_' + standing.teamName.replace(/\s+/g, '');
                newTeamToScrap.name = standing.teamName;
                newTeamToScrap.providers = [];
                newTeamToScrap.providers.push({
                    name: leagueInfo.providerInfo.name,
                    link: leagueInfo.providerInfo.link,
                });


                items.push(newTeamToScrap);
                logger.info(' » Set team ' + newTeamToScrap.name + ' (' + newTeamToScrap.country + ') to be scraped.');
            });

            //Fields to match on for upsert condition
            const matchFields = ['permalink'];

            //Perform bulk operation
            var result = TeamsToScrap.upsertMany(items, matchFields);

            logger.info('Updated ' + items.length + ' teams from ' + leagueInfo.name + ' to be scraped.');

            return res.json(doc);
        });
    });
};