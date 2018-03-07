'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

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
        goals: String,
        nationality: String,
        number: Number,
        position: String
    }],

    topScores: [{
        name: Number,
        matches: Number,
        name: String,
        position: Number,
        ratings: Number
    }],

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
module.exports = mongoose.model('Teams', TeamInfo, 'Teams');