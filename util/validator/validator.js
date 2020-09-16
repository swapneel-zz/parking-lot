
/**
 * Contains functions to perform order Validations
 * @type {class}
 */
class Validator {

    constructor(logger) {
        this.logger = logger;
    }

    validateRaiseParking(body) {
        const logger = this.logger;
        let response = false;
        let param = ["parking_date", "booking_date", "booking_time", "is_reserved", "vehicle_number", "vehicle_owner", "vehicle_enter_time"];

        for (let index of param) {
            if (body[index] == undefined || body[index] == null) {
                response = false;
                break;
            }
            else {
                response = true;
            } 
        }
        return response;
    }
	validateAvailableparkingLot(body) {
        const logger = this.logger;
        let response = false;
        let param = ["booking_date"];

        for (let index of param) {
            if (body[index] == undefined || body[index] == null) {
                response = false;
                break;
            }
            else {
                response = true;
            } 
        }
        return response;
    }
    
}
module.exports = Validator;
