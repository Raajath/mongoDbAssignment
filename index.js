const userSchema=require('./userSchema');
const mongoose=require('mongoose');
const User=mongoose.model('User', userSchema);

async function InsertValues(name, age, email, hobbies, address) {
  return await User.create({
    name: name,
    age: age,
    email: email,
    hobbies: hobbies,
    address: address,
  });
}


async function readByName(name) {
  return await User.where('name').equals(name);
}


async function updateAgeBasedOnName(name, updatedAge) {
  return await User.updateOne({name: name}, {$set: {age: updatedAge}});
}


async function deleteBasedOnName(name) {
  return await User.deleteMany({name: name});
}


module.exports={InsertValues, updateAgeBasedOnName, readByName, deleteBasedOnName};

