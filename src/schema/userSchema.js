const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: [5, "First name should be at least 5 characters long"],
    maxlength: [20, "First name should be less than or equal to 20 characters"],
    lowercase: true,
    trim: true // Remove extra spaces at the start and end
  },
  lastName: {
    type: String,
    minlength: [5, "Last name should be at least 5 characters long"],
    maxlength: [20, "Last name should be less than or equal to 20 characters"],
    lowercase: true,
    trim: true // Remove extra spaces at the start and end
  },
  mobileNumber: {
    type: String,
    trim: true,
    minlength: [10, "Enter a valid mobile number"],
    maxlength: [10, "Enter a valid mobile number"],
    unique: [true, "Phone number is already in use"],
    required: [true, "Phone number is required"]
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: [true, "Email is already in use"],
    match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email address"]
  },
  role:{
    type:String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should be at least 6 characters long"]
  },
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    }
  ]
  
},{timestamps:true});


userSchema.pre('save',async function(){
  const hashed = await bcrypt.hash(this.password,10)
  this.password = hashed


})


const User = mongoose.model('User', userSchema);

module.exports = User;
