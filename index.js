// initialize essentials
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cron = require('node-cron'),
    Auction = require('./api/models/AuctionModel'),
    Bid = require('./api/models/BidModel'),
    cronController = require('./api/controllers/CronController'),
    routes = require('./api/routes/routes'),
    port = process.env.PORT || 3030;

// mongoose instance connection url connection
mongoose.Promise = global.Promise
mongoose
    .connect('mongodb://mongo:27017/biddingService', {
        useCreateIndex: true,
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// mongoose.connect('mongodb://localhost/biddingService', {
//     useCreateIndex: true,
//     useNewUrlParser: true
// });

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// importing routes
routes(app);

// configure cron execution
cron.schedule("* * * * *", function() {
    cronController.UpdateAuctions();
});

// start to listen port
app.listen(port);

console.log('App running on port:' + port);