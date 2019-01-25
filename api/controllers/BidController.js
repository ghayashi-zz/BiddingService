'use strict';

// initialize variables
var mongoose = require('mongoose'),
    Bid = mongoose.model('Bid'),
    Auction = mongoose.model('Auction'),
    response = require('../helpers/ResponseHelper');

/**
 * Get Bid
 * values of bidID:
 *   'id' to return an bid
 *   'all' to return the list of bids
 */
exports.getBid = function (req, res) {
    var parameter = req.params.bidID;

    // if parameter sent is 'all'
    // then return the list of bids
    if (parameter == 'all') {
        Bid.find({}, null, {}, function (err, bids) {
            var message, httpStatusCode;

            if (err) {
                httpStatusCode = 404;
                message = {
                    Error: 'No Bids Founded !'
                };
            } else {
                httpStatusCode = 200;
                message = response.format(httpStatusCode, bids);
            }

            res.status(httpStatusCode).json(message).end();
        });
    } else {
        // otherwise return the bid according to the id sent
        Bid.findById(parameter, function (err, bid) {
            var message, httpStatusCode

            if (err) {
                httpStatusCode = 404;
                message = {
                    Error: 'No Bid Found !'
                };
            } else {
                httpStatusCode = 200;
                message = response.format(httpStatusCode, bid);
            }

            res.status(httpStatusCode).json(message).end();
        });
    }
}

/**
 * Create new bid
 */
exports.createBid = function (req, res) {
    var new_bid = new Bid(req.body);
    console.log(new_bid);

    // validate if auction exists before register a bid
    Auction.findById(new_bid.auctionID, function (err, auction) {
        if (err) {
            res.status(404).json({
                Error: 'No auction found to register a Bid'
            }).end();
        } else if (auction.status == 'pending') {
            res.status(404).json({
                Error: 'Auction didn\'t start yet and can\'t register a Bid'
            }).end();
        } else if (auction.startingPrice > new_bid.amount) {
            res.status(404).json({
                Error: 'Amount should be greather then Starting Price defined'
            }).end();
        } else {
            // if auction exists then update the highestBid if necessary
            new_bid.save(function (err, bid) {
                var message, httpStatusCode;

                if (err) {
                    httpStatusCode = 500;
                    message = {
                        'Error': err.message
                    };
                } else {
                    httpStatusCode = 201;
                    message = response.format(httpStatusCode, bid);
                    // verify the highest bid and update if necessary
                    registerHighestBid(bid);
                }

                res.status(httpStatusCode).json(message).end();
            });
        }
    });
}

function registerHighestBid(bid) {
    Bid.find({
        auctionID: bid.auctionID,
        amount: {
            $gt: bid.amount
        }
    }, function (err, bids) {
        if (err) {
            res.status(500).json({
                Error: err.message
            }).end();
        } else {
            // if no results found then update the auction
            if (bids.length == 0) {
                Auction.findOneAndUpdate({
                    _id: bid.auctionID
                }, {
                    highestBid: bid._id
                }, function (err, auction) {});
            }
        }
    })
}