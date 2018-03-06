'use strict';

var mongoose = require('mongoose'),
    Teams = mongoose.model('Teams'),
    TeamsToScrap = mongoose.model('TeamsToScrap'),
    async = require('async');



exports.get_pending_teams_to_scrap = function (req, res) {

    var filter = {};

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
                res.send(err);
            }
            res.json(house);
        });
};


exports.save_team_scrap_info = function (req, res) {
    var teamInfo = req.body;
    var teamName = req.params.team;

    var query = {
        'permalink': teamName
    };

    Teams.findOneAndUpdate(query, teamInfo, {
        upsert: true
    }, function (err, doc) {
        if (err)
            return res.sendStatus(500, {
                error: err
            });
        console.log('Teams info succesfully saved: ' + teamName);
        return res.sendStatus(200);
    });

};