'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var LeagueInfo = new Schema({

    name: String,

    permalink: String,

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

    facts: {
        devisionLevel: Number,
        numberRounds: Number,
        averageGoals: Number,
        homeTeamWins: String,
        draws: String,
        awayTeamWins: String,
        yellowCards: Number,
        redCards: Number,
    },


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