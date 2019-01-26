'use strict'

// initialize variables
var mongoose = require('mongoose'),
    Auction = mongoose.model('Auction'),
    response = require('../helpers/ResponseHelper');

/**
 * Get Auction
 * values of auctionID:
 *   'id' to return an auction
 *   'all' to return the list of auctions
 */
exports.getAuction = function (req, res) {
    var parameter = req.params.auctionID;
    var requestInfo = {
        type: req.method,
        path: req.url,
        body: null
    };

    // if parameter == 'all'
    if (parameter == 'all') {
        var size = !req.query.limit ? 10 : req.query.limit;
        var offset = !req.query.offset ? 0 : req.query.offset;

        Auction.find({}, null, {
            limit: parseInt(size),
            skip: parseInt(offset)
        }, function (err, auctions) {
            var message, httpStatusCode;
            if (err) {
                httpStatusCode = 404;
                message = response.format(requestInfo, httpStatusCode, {
                    Error: 'No auctions founded !'
                });
            } else {
                var pagination = {
                    limit: size,
                    offset: offset
                };

                httpStatusCode = 200;
                message = response.format(requestInfo, httpStatusCode, auctions, pagination);
            }


            res.status(httpStatusCode).json(message).end();
        });
    } else {
        // otherwise return the action according to the id sent
        Auction.findById(parameter, function (err, auction) {
            var message, httpStatusCode;
            if (err) {
                httpStatusCode = 404;
                message = response.format(requestInfo, httpStatusCode, {
                    Error: 'No auction found !'
                });
            } else {
                httpStatusCode = 200;
                message = response.format(requestInfo, httpStatusCode, auction);
            }

            res.status(httpStatusCode).json(message).end();
        });
    }
}

/**
 * Create new auction
 */
exports.createAuction = function (req, res) {
    var new_auction = new Auction(req.body);

    var start_time = new_auction.startTime.getTime();
    var end_time = new_auction.endTime.getTime();
    var current_time = new Date();

    var requestInfo = {
        type: req.method,
        path: req.path,
        body: JSON.stringify(req.body)
    };

    // validate start_time x end_time
    if (start_time >= end_time) {
        res.status(404).json({
            message: 'Start Time can\'t be equal or greatter than End Time'
        }).end();
    } else if (current_time.getTime() >= end_time) {
        res.status(404).json({
            message: 'End Time should be greatter than Current Time (now)'
        }).end();
    } else {
        // if start_time <= now() then status == ongoing
        if (start_time <= current_time.getTime()) {
            new_auction.status = 'ongoing';
        }

        // persist new auction to the database
        new_auction.save(function (err, auction) {
            var message, httpStatusCode;

            if (err) {
                httpStatusCode = 500;
                message = response.format(requestInfo, httpStatusCode, {
                    Error: err.message
                });
            } else {
                httpStatusCode = 201;
                message = response.format(requestInfo, httpStatusCode, auction);
            }

            res.status(httpStatusCode).json(message).end();
        });
    }
}

/**
 * Update Auction
 * @param from request: data used to update values
 */
exports.updateAuctionParameter = function (req, res) {
    var parameter = req.params.auctionID;

    var requestInfo = {
        type: req.method,
        path: req.path,
        body: JSON.stringify(req.body)
    };

    Auction.findOneAndUpdate({
        _id: parameter
    }, req.body, {
        new: true
    }, function (err, auction) {
        var message, httpStatusCode
        if (err) {
            httpStatusCode = 500;
            message = response.format(requestInfo, httpStatusCode, {
                Error: err.message
            });
        } else {
            httpStatusCode = 200;
            message = response.format(requestInfo, httpStatusCode, auction);
        }

        res.status(httpStatusCode).json(message).end();
    });
}