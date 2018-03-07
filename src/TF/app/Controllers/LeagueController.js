'use strict';

var request = require('request');
var apiBaseUrl = 'http://localhost:3000';


exports.get_league_info = function (req, res, callback) {

    var url = apiBaseUrl + '/info/leagues/' + req.params.permalink;

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }
    })
};


exports.get_country_leagues = function (req, res, callback) {

    var url = apiBaseUrl + '/info/countries/' + req.params.country;

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }
    })
};