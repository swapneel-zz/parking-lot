const ParkingService = require('../services/ParkingService');
const loggerCls = require('../util/logger/logger');
const ValidatorCls = require('../util/validator/validator');
const dbClient = require('../util/dbConnect');
dbClient.getConnection();

const raiseRequest = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    let logger = loggerCls.initLogger(event.requestContext.requestId, context.awsRequestId);
    const ParkingService = new ParkingService(logger);
    const validator = new ValidatorCls(logger);
    let body = JSON.parse(event.body);
    
    if (validator.validateRaiseParking(body)) {
        ParkingService.raiseRequest(body, function (error, record) {
            let response = {};
            if (error) {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: false,
                    errorFor: error
                });

            } else {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: true,
                    data: record
                });
            }
            callback(null, response);
        });
    }
    else {
        let response = {};
        response.statusCode = 200;
        response.headers = {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        };
        response.body = JSON.stringify({
            success: false,
            errorFor: {
                errorCode: "REQUEST_VALIDATION_ERR",
                errorMessage: "Some paramters are missing or Invalid"
            }
        });
        callback(null, response);
    }
   
};

const getAvailableParkingLot = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    let logger = loggerCls.initLogger(event.requestContext.requestId, context.awsRequestId);
    const ParkingService = new ParkingService(logger);
    const validator = new ValidatorCls(logger);
    let body = JSON.parse(event.body);
    
    if (validator.validateAvailableparkingLot(body)) {
        ParkingService.getAvailableParkingLot(body, function (error, record) {
            let response = {};
            if (error) {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: false,
                    errorFor: error
                });

            } else {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: true,
                    data: record
                });
            }
            callback(null, response);
        });
    }
    else {
        let response = {};
        response.statusCode = 200;
        response.headers = {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        };
        response.body = JSON.stringify({
            success: false,
            errorFor: {
                errorCode: "REQUEST_VALIDATION_ERR",
                errorMessage: "Some paramters are missing or Invalid"
            }
        });
        callback(null, response);
    }
   
};

const getOccupiedParkingLot = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    let logger = loggerCls.initLogger(event.requestContext.requestId, context.awsRequestId);
    const ParkingService = new ParkingService(logger);
    const validator = new ValidatorCls(logger);
    let body = JSON.parse(event.body);
    
    if (validator.validateAvailableparkingLot(body)) {
        ParkingService.getOccupiedParkingLot(body, function (error, record) {
            let response = {};
            if (error) {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: false,
                    errorFor: error
                });

            } else {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: true,
                    data: record
                });
            }
            callback(null, response);
        });
    }
    else {
        let response = {};
        response.statusCode = 200;
        response.headers = {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        };
        response.body = JSON.stringify({
            success: false,
            errorFor: {
                errorCode: "REQUEST_VALIDATION_ERR",
                errorMessage: "Some paramters are missing or Invalid"
            }
        });
        callback(null, response);
    }
   
};

const getRegisteredUsers = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    let logger = loggerCls.initLogger(event.requestContext.requestId, context.awsRequestId);
    const ParkingService = new ParkingService(logger);
    const validator = new ValidatorCls(logger);
    let body = JSON.parse(event.body);
    
    if (validator.validateAvailableparkingLot(body)) {
        ParkingService.getRegisteredUsers(body, function (error, record) {
            let response = {};
            if (error) {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: false,
                    errorFor: error
                });

            } else {
                response.statusCode = 200;
                response.headers = {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                };
                response.body = JSON.stringify({
                    success: true,
                    data: record
                });
            }
            callback(null, response);
        });
    }
    else {
        let response = {};
        response.statusCode = 200;
        response.headers = {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        };
        response.body = JSON.stringify({
            success: false,
            errorFor: {
                errorCode: "REQUEST_VALIDATION_ERR",
                errorMessage: "Some paramters are missing or Invalid"
            }
        });
        callback(null, response);
    }
   
};
module.exports = {
    raiseRequest: raiseRequest,
    getAvailableParkingLot:getAvailableParkingLot,
    getOccupiedParkingLot:getOccupiedParkingLot,
    getRegisteredUsers:getRegisteredUsers
};
