'use strict';

var mongoose = require('mongoose'),
    LeagueInfo = mongoose.model('Leagues'),
    async = require('async');


exports.create_league_info = function (req, res) {
    var newLeagueInfo = new LeagueInfo(req.body);
    newLeagueInfo.save(function (err, house) {
        if (err)
            res.send(err);
        res.json(house);
    });
};