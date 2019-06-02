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
        surroundings: [{ // for example the odor of the location or the precipitation
            description: String, // 'a foul stench lies in the air'
            threshold: Number, // threshold for when the user should be able to sense. Example: if measurings.value is 50ppm the threshold could be 20ppm 
            device: String // musst match one device of the measurings, so that it can be determined to which measure value the threshold is applied.
        }]
    }]
});

module.exports = mongoose.model('Operation', Operation);