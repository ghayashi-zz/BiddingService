'use strict'

var mongoose = require('mongoose'),
    Auction = mongoose.model('Bid')

exports.getBidList = function(req,res) {
    res.json('it works1')
}

exports.createBid = function(req,res) {
    res.json('it works')
}