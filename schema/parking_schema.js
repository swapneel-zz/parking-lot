var mongoose = require('mongoose');
/* parkingSchema */
var parkingSchema = new mongoose.Schema({
	parking_id: { type: String },
	parking_number: { type: String },
    parking_date: { type: Date },
    booking_date: { type: Date },
    booking_time: { type: Date },
    is_reserved: { type: String },
    vehicle_number: { type: String },
	vehicle_owner: { type: String },
	vehicle_enter_time: { type: Date },
	vehicle_exit_time: { type: Date },
}, { collection: 'parking' });


function getParkingModel() {
    if (mongoose.models && mongoose.models.parkingSchema) {
        return mongoose.models.parkingSchema;
    } else {
        return mongoose.model("parkingSchema", parkingSchema);
    }
}
module.exports = getParkingModel();






