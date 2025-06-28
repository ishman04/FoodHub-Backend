const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema({
    houseNumber: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
    },
    area: {
        type: String,
        required: true
    },
    placeName: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng:{
        type:Number,
        required: true
    }
})

const Address = mongoose.model("Address",addressSchema);

module.exports = Address