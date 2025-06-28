const geolib = require('geolib');
const { restaurantLocation, deliveryRadiusKm } = require('../config/location');

const checkDeliveryRadius = (req, res) => {
    const {lat, lng} = req.body;
    if(!lat || !lng){
        return res.status(400).json({message: 'Latitude and Longitude are required.'});
    }
    
    const dist = geolib.getDistance(
        {latitude: restaurantLocation.latitude, longitude: restaurantLocation.longitude},
        {latitude: lat, longitude: lng}
    );
    const distInKm = dist/1000;
    const isDeliverable = distInKm <= deliveryRadiusKm;
    return res.status(200).json({isDeliverable})
} 

const setExactAddress = (req,res) => {
    
}

module.exports = checkDeliveryRadius
