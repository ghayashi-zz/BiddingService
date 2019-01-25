'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BidSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Missing email']
  },
  amount: {
    type: Number,
    required: [true, 'Missing bid amount']
  },
  auctionID: { // unique identifier(reference to the auction)
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Missing auction ID'],
    ref: 'Auction'
  },
});

BidSchema.post('save', function(doc) {
  console.log('Bid %s has been saved', doc._id);
});

module.exports = mongoose.model('Bid', BidSchema);