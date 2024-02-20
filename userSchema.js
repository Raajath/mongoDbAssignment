const mongoose=require('mongoose');

const addressSchema=new mongoose.Schema({
  street: String,
  city: String,
});

const userSchema= new mongoose.Schema({
  name: String,
  age: {
    type: Number,
    min: 0,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: ()=>Date.now(), // current Date will enter if no date entered
  },
  hobbies: [String],
  address: addressSchema,
});

// pass normal function only
userSchema.methods.sayHi=function() {
  console.log( `hello hi, :${this.name}`);
};

// static level
userSchema.statics.findByName=function(name) {
  return this.where('name').equals(name);
};

userSchema.query.findName=function(name) {
  return this.where('name').equals(name);
};


module.exports=mongoose.model('User', userSchema);
