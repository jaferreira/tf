'use strict';

var request = require('request');


exports.get_league_info = function (req, res, callback) {

    

    var url = 'http://localhost:3000/info/leagues/' + req.params.permalink;

    console.log('calling: ' + url);

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }
    })
};