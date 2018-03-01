'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var LeagueToScrap = new Schema({
    
    name:{
        type: String
    },

    providers: [
        {
            provider: String,
            link: String
        }
    ],

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