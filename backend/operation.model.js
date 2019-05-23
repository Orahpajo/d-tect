const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Operation = new Schema({
    operation_number: String, //humban readable number of the operation
    measure_points: [{
        location: {lat: Number,lng: Number},
        measurings: [{ // different devices give different measure values. 
            device: String, // describes the device and activated sensor. Example: Gasdetectot pump with chloride sensor
            value: Number, // measured value at the center of the measure point. Example: 240 ppm
            unit: String, // unit of the measure. Example: Parts per Million (ppm)
        }],
        odor: { // odor or smell of the location
            description: String, 
            threshold: Number, // threshold for when the user should be able to smell the odor. Example: if 'value' is 50ppm the threshold could be 20ppm 
            measuring_number: Number // to which of the measurings does the threshold apply?
        },
        precipitation: { // things that fall from the sky around the location such as particles or smoke
            description: String, 
            threshold: Number, // threshold for when the user should be able to see the precipation. Example: if 'value' is 50ppm the threshold could be 20ppm 
            measuring_number: Number // to which of the measurings does the threshold apply?
        }
    }]
});

module.exports = mongoose.model('Operation', Operation);