'use strict';

module.exports = function (app) {
    // import controllers
    var AuctionController = require('../controllers/AuctionController');
    var BidController = require('../controllers/BidController');

    // Auction Routes
    app.get('/auction/:auctionID', AuctionController.getAuction);
    app.post('/auction', AuctionController.createAuction);
    app.patch('/auction/:auctionID', AuctionController.updateAuctionParameter);

    // Bid Routes
    app.get('/bid/:bidID', BidController.getBid);
    app.post('/bid', BidController.createBid);

    // prevent incorrect route to be called
    app.use(function (req, res) {
        res.status(404).send({
            url: req.originalUrl + ' not found'
        });
    });
}