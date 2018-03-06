'use strict';

var logger = require('../Logger.js'),
    mongoose = require('mongoose'),
    Leagues = mongoose.model('Leagues'),
    LeaguesToScrap = mongoose.model('LeaguesToScrap'),
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


exports.create_league_to_scrap = function (req, res) {
    var newLeagueToScrap = new LeaguesToScrap(req.body);
    newLeagueToScrap.save(function (err, house) {
        if (err) {
            logger.error(err);
            res.send(err);
        }
        res.json(house);
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

        LeaguesToScrap.findOneAndUpdate(query, { nextScrapAt: nextScrapDate}, {
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
            return res.json(doc);
        });
    });
};