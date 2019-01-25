'use strict'

var mongoose = require('mongoose'),
    Auction = mongoose.model('Auction'),
    response = require('../helpers/ResponseHelper')

// Get Auction from ID
exports.getAuction = function (req, res) {
    var parameter = req.params.auctionID

    // if parameter sent is 'all'
    // then return the list of auctions
    if (parameter == 'all') {
        Auction.find({}, null, {}, function(err, auctions) {
            var message, httpStatusCode
            if (err) {
                httpStatusCode = 404
                message = response.format(httpStatusCode,{message: 'No auctions founded !'})
            } else {
                httpStatusCode = 200
                message = response.format(httpStatusCode,auctions)
            }

            res.status(httpStatusCode).json(message).end()
        })
    } else {
        // otherwise return the action according to the id sent
        Auction.findById(parameter, function (err, auction) {
            var message, httpStatusCode
            if (err) {
                httpStatusCode = 404
                message = response.format(httpStatusCode,{message: 'No auction founded !'})
            } else {
                httpStatusCode = 200
                message = response.format(httpStatusCode,auction)
            }

            res.status(httpStatusCode).json(message).end()
        })
    }
}

// Create new Auction
exports.createAuction = function (req, res) {
    var new_auction = new Auction(req.body)

    new_auction.save(function (err, auction) {
        var message, httpStatusCode

        if (err) {
            httpStatusCode = 500
            message = response.format(httpStatusCode,{message: err.message})
        } else {
            httpStatusCode = 201
            message = response.format(httpStatusCode,auction)
        }

        res.status(httpStatusCode).json(message).end()
    })
}

// Update Auction status
exports.updateAuctionParameter = function (req, res) {
    var parameter = req.params.auctionID

    Auction.findOneAndUpdate({_id:parameter}, req.body, {new: true}, function(err, auction) {
        var message, httpStatusCode
        if (err) {
            httpStatusCode = 500
            message = response.format(httpStatusCode,{message: err.message})
        } else {
            httpStatusCode = 200
            message = response.format(httpStatusCode,auction)
        }

        res.status(httpStatusCode).json(message).end()
    })
}