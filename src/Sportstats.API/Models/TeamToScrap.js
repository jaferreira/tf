'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var TeamToScrapSchema = new Schema({
    
    name:{
        type: String
    },

    link:{
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, { collection: 'TeamsToScrap' });
TeamToScrapSchema.plugin(mongoosePaginate); 
module.exports = mongoose.model('TeamsToScrap', TeamToScrapSchema, 'TeamsToScrap');