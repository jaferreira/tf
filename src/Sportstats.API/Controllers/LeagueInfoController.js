'use strict';

var logger = require('../Logger.js'),
    mongoose = require('mongoose'),
    LeagueInfo = mongoose.model('Leagues'),
    async = require('async');


exports.create_league_info = function (req, res) {
    var newLeagueInfo = new LeagueInfo(req.body);
    newLeagueInfo.save(function (err, house) {
        if (err)
        {
            logger.error(err);
            res.send(err);
        }
        res.json(house);
    });
};

exports.get_league_info = function (req, res) {
    
    logger.info('Called get_league_info: ' + req.params.league);
    var filter = {
        permalink: req.params.league
    };

    var options = {
        page: 1,
        limit: 100,
        sort: {
            createdAt: -1
        }
    };

    LeagueInfo.paginate(
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