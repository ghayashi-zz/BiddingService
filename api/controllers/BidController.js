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
    var requestInfo = {
        type: 'GET',
        path: req.path,
        body: null
    };
    // if parameter sent is 'all'
    // then return the list of bids
    if (parameter == 'all') {
        Bid.find({}, null, {}, function (err, bids) {
            var message, httpStatusCode;

            if (err) {
                httpStatusCode = 404;
                response.format(requestInfo, httpStatusCode, {
                    Error: 'No Bids Founded !'
                });
            } else {
                httpStatusCode = 200;
                message = response.format(requestInfo, httpStatusCode, bids);
            }

            res.status(httpStatusCode).json(message).end();
        });
    } else {
        // otherwise return the bid according to the id sent
        Bid.findById(parameter, function (err, bid) {
            var message, httpStatusCode

            if (err) {
                httpStatusCode = 404;
                response.format(requestInfo, httpStatusCode, {
                    Error: 'No Bid Found !'
                });
            } else {
                httpStatusCode = 200;
                message = response.format(requestInfo, httpStatusCode, bid);
            }

            res.status(httpStatusCode).json(message).end();
        });
    }
}

/**
 * Create new bid
 */
exports.createBid = function (req, res) {
    var message, httpStatusCode;
    var new_bid = new Bid(req.body);
    var requestInfo = {
        type: 'POST',
        path: req.path,
        body: JSON.stringify(req.body)
    };

    // validate if auction exists before register a bid
    Auction.findById(new_bid.auctionID, function (err, auction) {
        if (err) {
            httpStatusCode = 404;
            message = response.format(requestInfo, httpStatusCode, {
                'Error': 'No auction found to register a Bid'
            });

            res.status(httpStatusCode).json(message).end();
        } else if (auction.status == 'pending' || auction.status == 'finished' ) {
            httpStatusCode = 404;
            message = response.format(requestInfo, httpStatusCode, {
                'Error': 'Can\'t register bid for auction: ' + auction._id + ' with status ' + auction.status
            });

            res.status(httpStatusCode).json(message).end();
        } else if (auction.startingPrice > new_bid.amount) {
            httpStatusCode = 404;
            message = response.format(requestInfo, httpStatusCode, {
                'Error': 'Amount should be greather then Starting Price defined'
            });

            res.status(httpStatusCode).json(message).end();
        } else {
            // if auction exists then update the highestBid if necessary
            new_bid.save(function (err, bid) {
                if (err) {
                    httpStatusCode = 500;
                    message = response.format(requestInfo, httpStatusCode, {
                        'Error': err.message
                    });
                } else {
                    httpStatusCode = 201;
                    message = response.format(requestInfo, httpStatusCode, bid);
                    // verify the highest bid and update if necessary
                    registerHighestBid(bid);
                }

                res.status(httpStatusCode).json(message).end();
            });
        }
    });
}

/**
 * Check the highest bid for an auction and update if necessary
 * @param {*} bid
 */
function registerHighestBid(bid) {
    Bid.find({
        auctionID: bid.auctionID,
        amount: {
            $gt: bid.amount
        }
    }, function (err, bids) {
        if (err) {
            winston.error(err.message);
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