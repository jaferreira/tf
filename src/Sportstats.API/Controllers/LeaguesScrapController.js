'use strict';

var mongoose = require('mongoose'),
    Leagues = mongoose.model('Leagues'),
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


exports.save_league_scrap_info = function (req, res) {
    var leagueInfo = req.body;
    var leagueName = req.params.league;

    var query = {
        'permalink': leagueName
    };

    Leagues.findOneAndUpdate(query, leagueInfo, {
        upsert: true
    }, function (err, doc) {
        if (err)
            return res.sendStatus(500, {
                error: err
            });
        console.log('League info succesfully saved: ' + leagueName);
        return res.sendStatus(200);
    });
};