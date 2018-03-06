'use strict';

var logger = require('../Logger.js'),
    mongoose = require('mongoose'),
    Teams = mongoose.model('Teams'),
    TeamsToScrap = mongoose.model('TeamsToScrap'),
    async = require('async');



exports.get_pending_teams_to_scrap = function (req, res) {

    var now = new Date();
    var filter = {
        nextScrapAt: { "$lte": now }
    };

    var options = {
        page: 1,
        limit: 100,
        sort: {
            createdAt: -1
        }
    };


    TeamsToScrap.paginate(
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


exports.save_team_scrap_info = function (req, res) {
    var teamInfo = req.body;
    var teamName = req.params.team;
    var nextScrapDate = req.body.nextScrapDate;

    var query = {
        'permalink': teamName
    };

    Teams.findOneAndUpdate(query, teamInfo, {
        upsert: true
    }, function (err, doc) {
        if (err){
            logger.error(err);
            return res.sendStatus(500, {
                error: err
            });
        }
            
        logger.info('Team info succesfully saved: ' + teamName);
        logger.info('Updating TeamsToScrap info for: ' + teamName + ' (nextScrapAt: ' + nextScrapDate + ')');
        
        TeamsToScrap.findOneAndUpdate(query, { nextScrapAt: nextScrapDate}, {
            upsert: true,
            new: true
        }, function (err, doc) {
            if (err) {
                logger.error(err);
                return res.sendStatus(500, {
                    error: err
                });
            }
            logger.info('Updated Succesfuly TeamsToScrap info for: ' + teamName);
            return res.json(doc);
        });
    });

};


exports.create_team_to_scrap = function (req, res) {
    var newTeamToScrap = new TeamsToScrap(req.body);
    newTeamToScrap.save(function (err, house) {
        if (err) {
            logger.error(err);
            res.send(err);
        }
        res.json(house);
    });
};