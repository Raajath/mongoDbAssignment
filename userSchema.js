const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: ()=>Date.now(),
  },
  hobbies: {
    type: [String],
  },
  address: {
    street: String,
    city: String,
  },
});


module.exports=userSchema;
