'use strict';

var request = require('request');
var apiBaseUrl = 'http://localhost:3000/api';


exports.get_league_info = function (req, res, callback) {

    var url = apiBaseUrl + '/leagues/' + req.params.permalink;

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

    var url = apiBaseUrl + '/countries/' + req.params.country + '/competitions';

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }
    })
};

exports.get_countries = function (req, res, callback) {

    var url = apiBaseUrl + '/countries';

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }
    })
};

