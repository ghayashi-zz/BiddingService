'use strict'

var mongoose = require('mongoose'),
    Auction = mongoose.model('Auction')

// Get Auction from ID
exports.getAuction = function (req, res) {
    var parameter = req.params.auctionID

    // if parameter sent is 'all'
    // then return the list of auctions
    if (parameter == 'all') {
        Auction.find({}, null, {}, function(err, auctions) {
            if (err) {
                res.status(404).json({
                    message: 'No Auctions founded'
                }).end()
            } else {
                res.status(200).json(auctions).end()
            }
        })
    } else {
        // otherwise return the action according to the id sent
        Auction.findById(parameter, function (err, auction) {
            if (err) {
                res.status(404).json({
                    message: 'Auction not found'
                }).end()
            } else {
                res.status(200).json(auction).end()
            }
        })
    }
}

// Create new Auction
exports.createAuction = function (req, res) {
    var new_auction = new Auction(req.body)

    new_auction.save(function (err, auction) {
        if (err) {
            res.status(500).json({
                message: err.message
            }).end()
        } else {
            res.status(201).json(auction).end()
        }
    })
}

// Update Auction status
exports.updateAuctionParameter = function (req, res) {
    var parameter = req.params.auctionID

    Auction.findOneAndUpdate({_id:parameter}, req.body, {new: true}, function(err, auction) {
        if (err) {
            res.status(500).json({
                message: err.message
            }).end()
        } else {
            res.status(200).json(auction).end()
        }
    })
}