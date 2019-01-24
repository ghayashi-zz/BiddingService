'use strict'

var mongoose = require('mongoose'),
    Bid = mongoose.model('Bid')

exports.getBid = function(req,res) {
    var parameter = req.params.bidID

    // if parameter sent is 'all'
    // then return the list of bids
    if (parameter == 'all') {
        Bid.find({}, null, {}, function(err, bids) {
            if (err) {
                res.status(404).json({
                    message: 'No Bids founded'
                }).end()
            } else {
                res.status(200).json(bids).end()
            }
        })
    } else {
        // otherwise return the bid according to the id sent
        Bid.findById(parameter, function (err, bid) {
            if (err) {
                res.status(404).json({
                    message: 'Bid not found'
                }).end()
            } else {
                res.status(200).json(bid).end()
            }
        })
    }
}

exports.createBid = function(req,res) {
    var new_bid = new Bid(req.body)

    new_bid.save(function (err, bid) {
        if (err) {
            res.status(500).json({
                message: err.message
            }).end()
        } else {
            res.status(201).json(bid).end()
        }
    })
}