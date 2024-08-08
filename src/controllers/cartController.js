const model = require('mongoose')
function getCartById(req,res){
    console.log("cart controller")
    res.json({
        message: "fine"
    })
}

module.exports = {
    getCartById
}