'use strict';

var uuid = require('uuid');
var winston = require('../../config/Logger');

exports.format = function (requestInfo, httpStatusCode, content, pagging = null) {
    var reqID = uuid.v1();
    var Meta = {
        status: httpStatusCode,
        now: new Date(),
        requestID: reqID
    };

    var Pagination;
    if (pagging != null) {
        Pagination = {
            Offset: pagging.offset,
            Limit: pagging.limit
        };
    }

    var result = [{
        Meta,
        Pagination,
        Results: content
    }];

    // adding logging
    var body = '';
    if (requestInfo.body != null) {
        body = requestInfo.body
    }

    winston.info(
        'requestID' +
        reqID + ' ' +
        requestInfo.type + ' ' +
        requestInfo.path + ' ' +
        'http_status: ' + httpStatusCode + ' ' +
        'body: ' + body + ' ' +
        'return: ' + JSON.stringify(content)
    );

    return result;
}