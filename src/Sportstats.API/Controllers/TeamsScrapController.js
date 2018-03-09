'use strict';

var logger = require('../Logger.js'),
    mongoose = require('mongoose'),
    Teams = mongoose.model('Teams'),
    TeamsToScrap = mongoose.model('TeamsToScrap'),
    async = require('async'),
    response = require('./Response.js');



exports.get_pending_teams_to_scrap = function (req, res) {

    var now = new Date();
    var filter = {
        nextScrapAt: { "$lte": now }
    };

    var options = {
        page: 1,
        limit: 1,
        sort: {
            createdAt: -1
        }
    };

    TeamsToScrap.paginate(
        filter,
        options,
        function (err, data) {
            if (err) {
                logger.error(err);
                return res.status(500).json(response.errorResponse(err));
            }
            return res.json(response.successResponse(data));
        });
};

exports.save_team_scrap_info = function (req, res) {

    var teamsData = req.body;

    var ids = [];
    logger.info('Saving ' + teamsData.length + ' teams:');
    teamsData.forEach(team => {
        if (!team.name || !team.country) {
            logger.info(' » A team has no required data! (skip item)');
        } else {
            ids.push(team.permalink);
            logger.info(' » (' + team.country + ') ' + team.name);
        }
    });

    TeamsToScrap.find({
        permalink: {
            $in: ids
        }
    }, function (err, dbTeamsToScrap) {
        if (err) {
            logger.error(err);
            return res.status(500).json(response.errorResponse(err));
        }
        logger.info('Got ' + dbTeamsToScrap.length + ' TeamsToScrap from db');
        if (dbTeamsToScrap.length == 0) {
            logger.info('Nothing to do...returning "204 No Content".');
            return res.status(204).json(response.errorResponse('Found no teams to update.'));
        }

        // UPDATE Next Scrap Date
        dbTeamsToScrap.forEach(teamInfo => {
            var newArray = teamsData.filter(function (el) {
                return el.permalink == teamInfo.permalink;
            });

            if (newArray.length > 0) {
                teamInfo.nextScrapAt = newArray[0].nextScrapAt;
                logger.info('New scrap date: ' + teamInfo.nextScrapAt);
            }
        });

        const matchFields = ['permalink'];

        var result2 = Teams.upsertMany(teamsData, matchFields);
        logger.info('Team info data succesfully saved for ' + teamsData.length + ' teams.');


        var result3 = TeamsToScrap.upsertMany(dbTeamsToScrap, matchFields);
        logger.info('Updated TeamsToScrap info with nextScrapAt.');

        return res.json(response.successResponse());
    });
};

exports.create_team_to_scrap = function (req, res) {
    var newTeamToScrap = new TeamsToScrap(req.body);
    newTeamToScrap.save(function (err, data) {
        if (err) {
            logger.error(err);
            res.send(err);
        }
        res.json(response.successResponse(data));
    });
};