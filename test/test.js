const {describe, it, beforeEach, before, after} = require('mocha');
const userSchema = require('../userSchema');
const chai = require('chai');
const expect = chai.expect;
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const {InsertValues, readByName, updateAgeBasedOnName, deleteBasedOnName}=require('../index');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const User=mongoose.model('User', userSchema);

let mongoServer;

before(async function() {
  mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri);
});


after(async function() {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Insertion check ', function() {
  beforeEach(async function() {
    await mongoose.connection.db.dropDatabase();
  });

  it('should retrieve the created user', async function() {
    const address={
      street: 'kav',
      city: 'mangalore',
    };
    await InsertValues('raj', 20, 'RAJA@GMAIL.COM', ['test', 'music'], address);
    const foundUser = await User.findOne({email: 'raja@gmail.com'});
    expect(foundUser).not.to.be.null;
  });

  it('should throw error when there is missing values', async function() {
    let error;
    try {
      await InsertValues();
    } catch (e) {
      error=e;
    }
    expect(error).to.exist;
    expect(error.errors).to.haveOwnProperty('name');
    expect(error.errors).to.haveOwnProperty('age');
    expect(error.errors).to.haveOwnProperty('email');
  });
});


describe('Reading Check', () => {
  let insertedUser;
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    const address={
      street: 'kav',
      city: 'mangalore',
    };
    insertedUser = await InsertValues('Raj123', 20, 'raj@yahoo.com', ['code'], address);
  });

  it('should retrieve the created user by name', async () => {
    const foundUser = await readByName('Raj123');
    expect(foundUser[0].name).to.equal(insertedUser.name);
  });

  it('should throw an error if the user is not found', async () => {
    const res = await readByName('Not present');
    expect(res).to.be.an('array');
    expect(res).to.have.lengthOf(0);
  });

  it('should handle invalid input ', async () => {
    const res = await readByName();
    expect(res).to.be.an('array');
    expect(res).to.have.lengthOf(0);
  });
});

describe('Update age Check', () => {
  let user;
  const beforeAge=10;
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    const address={
      street: 'kav',
      city: 'mangalore',
    };
    user = await InsertValues('Raja', beforeAge, 'raj@gmail.com', ['code'], address);
  });

  it('should update the age of the specified user', async () => {
    const updatedObject=await updateAgeBasedOnName(user.name, 35);
    const updatedUser = await readByName(user.name);
    expect(updatedObject.modifiedCount).not.equal(0);
    expect(updatedUser[0].age).to.equal(35);
  });

  it('should not update if the user is not found', async () => {
    const result= await updateAgeBasedOnName('nonexist', 20);
    expect(result.modifiedCount).equal(0);
  });
});

describe('Delete Check', () => {
  let user;
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    const address={
      street: 'kav',
      city: 'mangalore',
    };
    user = await InsertValues('Raja', 10, 'raj@gmail.com', ['code'], address);
  });

  it('should delete record from database', async () => {
    const deletedObject=await deleteBasedOnName(user.name);
    expect(deletedObject.deletedCount).not.equal(0);
  });

  it('should tell if given name is not in database', async () => {
    const deletedObject=await deleteBasedOnName('not present');
    expect(deletedObject.deletedCount).equal(0);
  });

  it('should tell if given input name is empty', async () => {
    const deletedObject=await deleteBasedOnName();
    expect(deletedObject.deletedCount).equal(0);
  });
});


describe('User Schema', () => {
  it('should have valid type and propery definitions for each field', async () => {
    const address={
      street: 123,
      city: 5,
    };
    const user=await InsertValues(23, '22', 12345678, [12], address);
    // Check type definitions
    expect(user).to.have.property('name');
    expect(user).to.have.property('age');
    expect(user).to.have.property('email');
    expect(user).to.have.property('createdAt');
    expect(user).to.have.property('address');
    expect(user.name).to.be.a('string');
    expect(user.age).to.be.a('number');
    expect(user.email).to.be.a('string');
    expect(user.createdAt).to.be.a('date');
    expect(user.hobbies).to.be.an('array');
    expect(user.address).to.be.an('object');

    expect(user.name).to.not.be.a('number');
    expect(user.age).to.not.be.a('string');
    expect(user.email).to.not.be.a('number');
    expect(user.address.street).to.not.be.a('number');
    expect(user.address.city).to.not.be.a('number');
    expect(user.hobbies[0]).to.not.be.a('number');
  });
});

