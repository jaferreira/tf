'use strict';

var mongoose = require('mongoose'),
    LeaguesToScrap = mongoose.model('LeaguesToScrap'),
    async = require('async');



exports.get_pending_leagues_to_scrap = function (req, res) {

    var filter = {};

    var options = {
        page: 1,
        limit: 100,
        sort: {
            createdAt: -1
        }
    };

    LeaguesToScrap.paginate(
        filter,
        options,
        function (err, house) {
            if (err) {
                res.send(err);
            }
            res.json(house);
        });
};


exports.create_league_to_scrap = function (req, res) {
    var newLeagueToScrap = new LeaguesToScrap(req.body);
    newLeagueToScrap.save(function (err, house) {
        if (err)
            res.send(err);
        res.json(house);
    });
};


// exports.save_scrap_result = function (req, res) {
//     var bulk = req.body;
//     LeaguesToScrap.insertMany(bulk, function (err, houses) {
//         if (err)
//             res.send(err);
//         res.json(houses);
//     });
// };