
'use strict';
const bunyan = require('bunyan');

const name = "parking-Logs"; 
const logLevel = "error";

var initLogger = function (requestID, serviceID) {
    return bunyan.createLogger({
        name: name,
        level: logLevel,
        serviceID: serviceID,
        requestID: requestID
    });
};

module.exports = { initLogger: initLogger };
