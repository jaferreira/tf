'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var TeamInfo = new Schema({

    mostTitles: {
        type: String
    },

    titleHolder: String,

    mostTitlesNumber: {
        type: Number
    },

    topScores: [{
        goals: Number,
        matches: Number,
        name: String,
        position: Number,
        rating: Number,
        team: String
    }],

    facts: [{
        key: String,
        value: String
    }],

    newcomers: [],

    standings: [{
        defeateds: Number,
        draws: Number,
        gamesPlayed: Number,
        goalConceded: Number,
        goalScored: Number,
        lastResults: [],
        points: Number,
        position: Number,
        teamLink: String,
        teamName: String,
        wins: Number
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, {
    collection: 'Leagues'
});
LeagueInfo.plugin(mongoosePaginate);
module.exports = mongoose.model('Leagues', LeagueInfo, 'Leagues');