const ParkingModel = require("../schema/parking_schema");

const Mongoose = require('mongoose');
const moment = require("moment");
let _ = require("lodash");
const striptags = require("striptags");

const AWS = require("aws-sdk");
const STAGE = process.env.DEPLOYMENT_STAGE;
const AWS_ACC_ID = "";

const sns = new AWS.SNS({
    region: "ap-south-1"
});


class ParkingService {

  constructor(logger) {
    this.logger = logger;
  }
	
	raiseRequest(body, callback) {
        const logger = this.logger;
        const that = this;
        
        (async () => {
        let ParkingNumber = await ParkingModel.findOne({ "parking_date": moment(new Date()).add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"), vehicle_enter_time: null })
													.select("parking_number, is_reserved, booking_time")
													.sort({complaint_number:-1})
													.count("is_reserved")
													.limit(1)
													.lean();
        let ParkingNumberIncr = 0;
        if (!ParkingNumber == null){
			 ParkingNumberIncr = ParkingNumber.parking_number;
		}
		
		if (!ParkingNumberIncr == 0) {
			
			if (ParkingNumberIncr >= 120 ) {
				return callback({
                errorCode: "Parking_full",
                errorMessage: "Parking is full"
            }, null);
				
			} else if (ParkingNumberIncr < 60 ) {
				// if parking is available
				if ( ParkingNumberIncr <120 && ParkingNumber.is_reserved < 25 && body.is_reserved == 'yes' ) {
					// if parking is available and reserved parking is available for reserve request
					this.raiseParkingRequest(body,ParkingNumberIncr,callback);
					
				} else {
					// raised request for non reserved vehicle_enter_time
					this.raiseParkingRequest(body,ParkingNumberIncr,callback);
				}
			
			} else {
				// if parking is 50% full
				if (ParkingNumber.booking_time > moment(new Date()).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") ) {
					// if parking is 50% full eliminate 30 min time
					this.raiseParkingRequest(body,ParkingNumberIncr,callback);
				} 
			}
		}
        )
		})();
    }
	
	raiseParkingRequest(data,ParkingNumber,callback) {
		const parking_data = {
			"complaint_number":ParkingNumber+1,
            "parking_date":moment().utc().format(),
			"booking_date":moment().utc().format(),
			"booking_time":moment().utc().format(),
			"is_reserved":body.is_reserved,
			"vehicle_number":body.vehicle_number,
			"vehicle_owner":body.vehicle_owner,
			"vehicle_enter_time":body.vehicle_enter_time,
			"vehicle_exit_time":body.vehicle_exit_time
        }
        
        ParkingModel.create(parking_data).then((parking) => {
			
			return callback(null, parking);
        }).catch((err) => {
            logger.error(err, 'Error Creating Document(s) in Db.');
            return callback({
                errorCode: "DB_WRITE_ERR",
                errorMessage: "Error Creating Document(s) in Db."
            }, null);
        }
	}
	
	    
    getAvailableParkingLot(body, callback) {
        const logger = this.logger;
        
        let condition = {
            booking_date: moment(new Date(body.booking_date)).format("YYYY-MM-DD HH:mm:ss"),
			booking_time: moment(new Date(body.booking_date)).add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
			vehicle_enter_time : null
        }

        ParkingModel.find(condition)
			.select("parking_number")
			.sort({parking_number:-1})
			.limit(1)
            .lean()
            .exec((err, parking) => {
                if (err) {
                    logger.error(err, 'Error Finding Document(s) in Db.');
                    return callback({
                        errorCode: "DB_READ_ERR",
                        errorMessage: "Error Finding Document(s) in Db."
                    }, null);
                }
				
				if (parking) {
					let availableParking = 120- parking.parking_number;
					let result = {
                        parking_available: availableParking
                    }
                    callback(null, result);
                }
			});         
    }
	
	getOccupiedParkingLot(body, callback) {
        const logger = this.logger;
        
        let condition = {
            booking_date: moment(new Date(body.booking_date)).format("YYYY-MM-DD HH:mm:ss"),
			booking_time: moment(new Date(body.booking_date)).add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
			vehicle_enter_time : null
        }

        ParkingModel.find(condition)
			.select("parking_number")
			.sort({parking_number:-1})
			.limit(1)
            .lean()
            .exec((err, parking) => {
                if (err) {
                    logger.error(err, 'Error Finding Document(s) in Db.');
                    return callback({
                        errorCode: "DB_READ_ERR",
                        errorMessage: "Error Finding Document(s) in Db."
                    }, null);
                }
				
				if (parking) {
					let result = {
                        occupied_parking: parking.parking_number
                    }
                    callback(null, result);
                }
			});         
    }
    
    getRegisteredUsers(body, callback) {
		const logger = this.logger;
        
        let condition = {
            booking_date: moment(new Date(body.booking_date)).format("YYYY-MM-DD HH:mm:ss"),
			vehicle_enter_time: { $exists: true, $ne: null
	    }

        ParkingModel.find(condition)
			.select(vehicle_owner,vehicle_number)
			.sort({parking_number:-1})
            .lean()
            .exec((err, parking) => {
                if (err) {
                    logger.error(err, 'Error Finding Document(s) in Db.');
                    return callback({
                        errorCode: "DB_READ_ERR",
                        errorMessage: "Error Finding Document(s) in Db."
                    }, null);
                }
				
				if (parking) {
					
                    callback(null, parking);
                }
			});    
	}

}


module.exports = ParkingService;
