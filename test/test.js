const {describe, it}=require('mocha');
const assert = require('assert');
const {connectDb, InsertValues, closeDbConnection, readByName
  , updateAgeBasedOnName, deleteBasedOnName} = require('../index');


const url='mongodb://localhost/testDb';

describe('Database Connection', function() {
  it('should check if it is connected to DataBase or not', async function() {
    try {
      const result = await Promise.race([
        connectDb(url),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout: Connection to database took too long'));
          }, 7000);
        }),
      ]);
      assert.strictEqual(result, 'sucessful');
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });
});


describe('Inserting Values to Database', function() {
  it('should check if values are inserted or not', async function() {
    const result=await InsertValues('harry', 50, 'harb@gmail.com', ['code', 'read']);
    assert.strictEqual(result, 'sucessful');
  });
});


describe('Reading Check', function() {
  it('should check data is read with name', async function() {
    const result=await readByName('prakash');
    assert.strictEqual(result, 'sucessful');
  });
});

describe('Update Check', function() {
  it('should update age based on input parameter name', async function() {
    const result=await updateAgeBasedOnName('harry', 70);
    assert.strictEqual(result, 'sucessful');
  });
});

describe('Delete Check', function() {
  it('should delete based on input parameter name', async function() {
    const result=await deleteBasedOnName('raj');
    assert.strictEqual(result, 'sucessful');
  });
});


describe('Closing DB Connection', function() {
  it('should check if Database is closing or not', async function() {
    const result=await closeDbConnection();
    assert.strictEqual(result, 'sucessful');
  });
});
