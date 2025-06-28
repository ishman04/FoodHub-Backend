const geolib = require('geolib');
const { restaurantLocation, deliveryRadiusKm } = require('../config/location');
const Address = require('../schema/addressSchema');
const User = require('../schema/userSchema');

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

const setExactAddress = async(req,res) => {
    try {
       const user = req.user.id;
    const data = req.body
    if(!data){
        return res.status(400).json({message: 'No data provided.'});
    }
    const exactAddress = await Address.create({
        user: user,
        houseNumber: data.houseNumber,
        landmark: data.landmark,
        area: data.area,
        placeName: data.placeName,
        lat: data.lat,
        lng: data.lng
    })
    await User.findByIdAndUpdate(user, {
      $push: { address: exactAddress._id }
    });

    res.status(201)
        .json({
            success: true,
            message: 'Address created successfully.',
            data: exactAddress,

        }) 
    } catch (error) {
        console.log(error)
        res.status(400)
            .json({
                success: false,
                message: 'Failed to create address.',
                error: error.message
            })
    }
    
}
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('address');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message,
    });
  }
};


module.exports = {
    checkDeliveryRadius,
    setExactAddress,
    getUserAddresses
}
