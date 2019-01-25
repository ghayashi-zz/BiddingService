'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuctionSchema = new Schema({
  item: {
    type: String,
    required: [true, 'Missing item name']
  },
  description: {
    type: String,
    required: [true, 'Missing description']
  },
  email: {
    type: String,
    required: [true, 'Missing e-mail']
  },
  startingPrice: {
    type: Number,
    required: [true, 'Missing starting price']
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'finished']
    }],
    default: 'pending',
    required: true
  },
  highestBid: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Bid'
  },
  startTime: {
    type: Date,
    required: [true, 'Missing start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Missing end time']
  }
});

AuctionSchema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});

module.exports = mongoose.model('Auction', AuctionSchema);