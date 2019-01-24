'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BidSchema = new Schema({
  // _id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   index: true,
  //   required: true,
  //   auto: true,
  // },
  email: String, 
  auctionID: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Auction'
  }, // unique identifier(reference to the auction)  
})

module.exports = mongoose.model('Bid', BidSchema)