const mongoose =require('mongoose');
const User=require('./userSchema');


async function connectDb(url) {
  try {
    await mongoose.connect(url);
    return 'sucessful';
  } catch (e) {
    console.log(e.message);
    return 'Failed to Eatablish Connection';
  }
}


async function InsertValues(name, age, email, hobbies, street, city) {
  try {
    /* Alternate
const user=new User({name:"Rajath",age:21});
user.save().then(()=>console.log("user saved"));
    */
    const user=await User.create({
      name: name,
      age: age,
      email: email,
      hobbies: hobbies,
      address: {
        street: street,
        city: city,
      },
    });
    console.log(user);
    return 'sucessful';
  } catch (e) {
    console.log(e.message);
    return 'failed to insert Value';
  }
}


async function readByName(name) {
  try {
    /* const findQuery=await User.where('age').gt(21).where('name').equals('raaaj').
    limit(1).select('email'); */
    const findData=await User.where('name').equals(name);
    console.log(findData);
    // const ele= await User.find({name:'Rajath'}) Alternate
    return 'sucessful';
  } catch (e) {
    console.log(e.message);
    return 'failed to radByName';
  }
}


async function readById(id) {
  try {
    const data=await User.findById(id).select('name');
    console.log(data);
    return 'sucessful';
  } catch (e) {
    console.log(e.message);
    return 'failed to readById';
  }
}


async function updateAgeBasedOnName(name, updatedAge) {
  try {
    // use update Many to update many entries
    const updatedResult= await User.updateOne({name: name}, {$set: {age: updatedAge}});
    console.log(updatedResult);
    return 'sucessful';
  } catch (e) {
    console.log(e.message);
    return 'failed to update age based on name';
  }
}


async function deleteBasedOnName(name) {
  // can use delete many
  try {
    const res=await User.deleteMany({name: name});
    console.log(res);
    return 'sucessful';
  } catch (e) {
    console.log(e.message);
    return 'failed to delete';
  }
}


async function tryMyMethods() {
  try {
    const m1=await User.findOne({name: 'arjun'}); // works in only this syntax
    console.log(m1);
    m1.sayHi();

    const m2= await User.findByName('arjun'); // here After User findByName is called
    console.log(m2);

    const m3=await User.find().findName('arjun');
    // here after find() extra filtering findName is used
    console.log(m3);
    return 'sucessful';
  } catch (e) {
    console.log(e.message);
    return 'failed as some methods did not work';
  }
}


async function closeDbConnection() {
  try {
    await mongoose.disconnect();
    return 'sucessful';
  } catch (e) {
    console.log( e.message);
    return 'failed to disconnect';
  }
}


module.exports={connectDb, readByName, readById, InsertValues,
  updateAgeBasedOnName, deleteBasedOnName, tryMyMethods, closeDbConnection};

