'use strict';

var mongoose = require('mongoose'),
    Auction = mongoose.model('Auction');

exports.UpdateAuctions = function() {
    console.log("----------- CRON JOB ------------");

    Auction.find({}, null, {}, function (err, auctions) {
        if (err) {
            console.log('Error: ' + err.Message);
        } else if (auctions.length > 0) {
            var current_time = new Date();
            auctions.forEach(function(auction) {
                if ( auction.endTime.getTime() <= current_time.getTime() ) {
                    // Update auctions to finished status
                    console.log('Auction: ' + auction._id + ' expired');
                    Auction.findOneAndUpdate({
                        _id: auction._id
                    }, {
                        status: 'finished'
                    }, function (err, auction) {});
                } else if ( auction.startTime.getTime() <= current_time.getTime() && auction.status == 'pending' ) {
                    // update auctions to ongoing status
                    console.log('Auction: ' + auction._id + ' updated');
                    Auction.findOneAndUpdate({
                        _id: auction._id
                    }, {
                        status: 'ongoing'
                    }, function (err, auction) {});
                }
            });
        } else {
            console.log('No auctions founded');
        }
    });

    console.log("---------------------------------");
}