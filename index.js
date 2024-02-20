const mongoose =require('mongoose');
const User=require('./userSchema');

// can use async or then method
mongoose.connect('mongodb://localhost/testDb')
    .then(() => {
      console.log('Connected successfully');
    })
    .catch((error) => {
      console.error('Error occurred while connecting:', error);
    });


async function InsertValues() {
  try {
    /* Alternate
const user=new User({name:"Rajath",age:21});
user.save().then(()=>console.log("user saved"));
    */
    const user1=await User.create({
      name: 'goyal',
      age: 26,
      email: 'rma@gmailsd.com',
      hobbies: ['dance', 'music'],
      address: {
        street: 'c Street',
        city: 'mangalore',
      },
    });
    console.log(user1);
    const user2=await User.create({
      name: 'sam',
      age: 34,
      email: 'sam@gmail.com',
      hobbies: ['dance', 'music', 'test'],
      address: {
        street: 'c Street',
        city: 'delhi',
      },
    });
    console.log(user2);
    const user3=await User.create({
      name: 'arjun',
      age: 40,
      email: 'arj@gmailsd.com',
      hobbies: ['dance', 'music'],
      address: {
        street: 'c Street',
        city: 'bangalore',
      },
    });
    console.log(user3);
    const user4=await User.create({
      name: 'prakash',
      age: 34,
      email: 'prakash@gmailsd.com',
      hobbies: ['dance', 'eat'],
      address: {
        street: 'c Street',
        city: 'bombay',
      },
    });
    console.log(user4);
  } catch (e) {
    console.log(e.message);
  }
}
InsertValues();


async function readByName(name) {
  try {
    /* const findQuery=await User.where('age').gt(21).where('name').equals('raaaj').
    limit(1).select('email'); */
    const findData=await User.where('name').equals(name);
    console.log(findData);
    // const ele= await User.find({name:'Rajath'}) Alternate
  } catch (e) {
    console.log(e.message);
  }
}
readByName('arjun');

async function readById(id) {
  try {
    const data=await User.findById(id).select('name');
    console.log(data);
  } catch (e) {
    console.log(e.message);
  }
}
readById('65d45cc2933cd6449aff681d');


async function updateAgeBasedOnName(name, updatedAge) {
  try {
    // use update Many to update many entries
    const updatedResult= await User.updateOne({name: name}, {$set: {age: updatedAge}});
    console.log(updatedResult);
  } catch (e) {
    console.log(e.message);
  }
}
updateAgeBasedOnName('Rajath', 30);

async function deleteBasedOnName(name) {
  // can use delete many
  try {
    const res=await User.deleteMany({name: name});
    console.log(res);
  } catch (e) {
    console.log(e.message);
  }
}
deleteBasedOnName('tr');

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
  } catch (e) {
    console.log(e.message);
  }
}
tryMyMethods();


