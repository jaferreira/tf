'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var upsertMany = require('@meanie/mongoose-upsert-many');

var TeamInfo = new Schema({

    teamInfo: {
        capacity: String,
        city: String,
        manager: String,
        stadium: String
    },

    country: String,

    name: String,

    providerInfo: {
        name: String,
        link: String
    },

    permalink: String,

    squad: [{
        name: String,
        nationality: String,
        number: Number,
        position: String
    }],

    topScores: [{
        goals: Number,
        matches: Number,
        name: String,
        position: Number,
        ratings: Number
    }],

    nextGame: {
        homeLineup: [{
            left: String,
            right: String,
            top: String,
            name: String
        }],
        awayLineup:  [{
            left: String,
            right: String,
            top: String,
            name: String
        }],
        homeNews:  [{
            text: String
        }],
        awayNews: [{
            text: String
        }],
        missingHomePlayers: [{
            reason: String,
            status: String,
            name: String
        }],
        missingAwayPlayers: [{
            reason: String,
            status: String,
            name: String
        }]
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, {
        collection: 'Teams'
    });
TeamInfo.plugin(mongoosePaginate);
TeamInfo.plugin(upsertMany);
module.exports = mongoose.model('Teams', TeamInfo, 'Teams');