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
    winston = require('./config/Logger'),
    port = process.env.PORT || 3030;

// mongoose instance connection url connection
mongoose.Promise = global.Promise
mongoose
    .connect('mongodb://localhost/biddingService', {
        // .connect('mongodb://mongo:27017/biddingService', {
        useCreateIndex: true,
        useNewUrlParser: true
    })
    .then(() => winston.debug('MongoDB Connected'))
    .catch(err => winston.error(err));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// importing routes
routes(app);

// configure cron execution
cron.schedule("* * * * *", function () {
    cronController.UpdateAuctions();
});

// start to listen port
app.listen(port);

winston.info('App running on port 3030');