const {describe, it, beforeEach, before, after} = require('mocha');
const userSchema = require('../userSchema');
const chai = require('chai');
const expect = chai.expect;
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const {InsertValues, readByName, updateAgeBasedOnName, deleteBasedOnName}=require('../index');
const User=mongoose.model('User', userSchema);

let mongoServer;

before(async ()=>{
  mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri);
});


after(async ()=>{
  await mongoose.disconnect();
  await mongoServer.stop();
});

const testCaseInsert=[

  {
    name: 'raja',
    age: 21,
    email: 'RAJ@GMAIL.COM',
    hobbies: ['music'],
    address: {
      street: 'kv',
      city: 'man',
    },
  },
  {
    name: null,
    age: null,
    email: null,
    hobbies: null,
    address: null,
  },
];

describe('Insertion check ', function() {
  beforeEach(async function() {
    await mongoose.connection.db.dropDatabase();
  });

  it('should test if values are inserted propely', async ()=> {
    for (const test of testCaseInsert) {
      try {
        await InsertValues(test.name, test.age, test.email, test.hobbies, test.address);
        const foundUser = await User.findOne({email: (test.email).toLowerCase()});
        expect(foundUser).not.to.be.null;
      } catch (error) {
        const checker=error.errors;
        expect(error).to.exist;
        expect(checker).to.haveOwnProperty('name');
        expect(checker).to.haveOwnProperty('age');
        expect(checker).to.haveOwnProperty('email');
      }
    }
  });
});

const testCaseRead =['testInsert', ''];

describe('Reading Check', () => {
  let insertedUser;
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    insertedUser = await InsertValues('testInsert', 20, 'raj@yahoo.com', ['code']);
  });

  it('should retrieve the created user by name', async () => {
    for (const test of testCaseRead) {
      try {
        const foundUser = await readByName(test);
        expect(foundUser[0].name).to.equal(insertedUser.name);
      } catch (err) {
        expect(err).to.exist;
      }
    }
  });
});


const testCaseUpdate=[
  {
    age: 40,
    name: 'raja',
  },
  {
    age: 22,
    name: 'bank',
  },
];

describe('Update age Check', () => {
  const beforeAge=10;
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should update the age of the specified user', async () => {
    for (const test of testCaseUpdate) {
      expect(test.age).to.be.within(0, 100);
      const user = await InsertValues(test.name, beforeAge, 'raj@gmail.com');
      const updatedObject=await updateAgeBasedOnName(user.name, test.age);
      const updatedUser = await readByName(user.name);
      expect(updatedObject.modifiedCount).not.equal(0);
      expect(updatedUser[0].age).to.equal(test.age);
    }
  });
});

const testCaseDelete=['Raja', 'hello'];

describe('Delete Check', () => {
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should delete record from database', async () => {
    for (const test of testCaseDelete) {
      await InsertValues(test, 10, 'raj@gmail.com');
      await deleteBasedOnName(test);
      const count = await User.countDocuments();
      expect(count).equals(0);
    }
  });
});


describe('User Schema', () => {
  it('should have valid type and propery definitions for each field', async () => {
    const address={
      street: 123,
      city: 5,
    };
    const user=await InsertValues(23, '22', 12345678, [12], address);
    expect(user).to.have.property('createdAt');
    expect(user.createdAt).to.be.a('date');

    expect(user.name).to.not.be.a('number');
    expect(user.age).to.not.be.a('string');
    expect(user.email).to.not.be.a('number');
    expect(user.address.street).to.not.be.a('number');
    expect(user.address.city).to.not.be.a('number');
    expect(user.hobbies[0]).to.not.be.a('number');
  });
});

