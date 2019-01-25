'use strict'

var mongoose = require('mongoose'),
    Bid = mongoose.model('Bid'),
    response = require('../helpers/ResponseHelper')

exports.getBid = function(req,res) {
    var parameter = req.params.bidID

    // if parameter sent is 'all'
    // then return the list of bids
    if (parameter == 'all') {
        Bid.find({}, null, {}, function(err, bids) {
            var message, httpStatusCode

            if (err) {
                httpStatusCode = 404
                message = response.format(httpStatusCode,{message:'No Bids Founded !'})
            } else {
                httpStatusCode = 200
                message = response.format(httpStatusCode,bids)
            }

            res.status(httpStatusCode).json(message).end()
        })
    } else {
        // otherwise return the bid according to the id sent
        Bid.findById(parameter, function (err, bid) {
            var message, httpStatusCode

            if (err) {
                httpStatusCode = 404
                message = response.format(httpStatusCode,{message:'No Bid Found !'})
            } else {
                httpStatusCode = 200
                message = response.format(httpStatusCode,bids)
            }

            res.status(httpStatusCode).json(message).end()
        })
    }
}

exports.createBid = function(req,res) {
    var new_bid = new Bid(req.body)

    new_bid.save(function (err, bid) {
        var message, httpStatusCode

        if (err) {
            httpStatusCode = 500
            message = response.format(httpStatusCode,{'message': err.message})
        } else {
            httpStatusCode = 201
            message = response.format(httpStatusCode,bids)
        }

        res.status(httpStatusCode).json(message).end()
    })
}