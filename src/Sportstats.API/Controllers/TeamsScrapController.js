'use strict';

var mongoose = require('mongoose'),
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


exports.save_scrap_result = function (req, res) {
    var bulk = req.body;
    TeamsToScrap.insertMany(bulk, function (err, houses) {
        if (err)
            res.send(err);
        res.json(houses);
    });
};