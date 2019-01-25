'use strict';

var uuid = require('uuid');

exports.format = function(httpStatusCode,content, pagging = null) {
    var result = [{
        Meta: {
            status: httpStatusCode,
            now: new Date(),
            requestID: uuid.v1()
        },
        Pagination: {
            Total: pagging != null && pagging.hasOwnProperty('total') ? pagging.total : 1,
            Offset: pagging != null && pagging.hasOwnProperty('offset') ? pagging.offset : 1 ,
            Limit: pagging != null && pagging.hasOwnProperty('limit') ? pagging.limit : 1
        },
        Results: [{content}]
    }];

    return result;
}