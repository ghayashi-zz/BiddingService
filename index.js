// import express
// initialize express
// set default port to run the application
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Auction = require('./api/models/AuctionModel'),
    Bid = require('./api/models/BidModel'),
    port = process.env.PORT || 3030

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// mongoose instance connection url connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/biddingService', {
    useCreateIndex: true,
    useNewUrlParser: true
})

// importing routes
var routes = require('./api/routes/routes')
routes(app)

// start to listen port
app.listen(port)

console.log('App running on port:' + port)