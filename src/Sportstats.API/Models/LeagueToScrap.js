'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var LeagueToScrap = new Schema({
    

    sport: String,

    gameTime: Number,

    permalink: String,

    name: String,

    country: String,

    providers: [
        {
            provider: String,
            link: String
        }
    ],

    scrapedAt:{
        type: Date
    },

    nextScrapAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date
    }
}, { collection: 'LeaguesToScrap' });
LeagueToScrap.plugin(mongoosePaginate); 
module.exports = mongoose.model('LeaguesToScrap', LeagueToScrap, 'LeaguesToScrap');