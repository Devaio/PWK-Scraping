var MongoClient = require('mongodb').MongoClient,
       ObjectID = require('mongodb').ObjectID,
         assert = require('assert')

var url = 'mongodb://localhost:27017/gear'

// ----------------------------------------------------------
// Accessible Functions - exported by interfaceDB
// ----------------------------------------------------------
module.exports = {
  addGear : function(gearItem){
    MongoClient.connect(url, function(err,db){
      assert.equal(null,err)
      insertGearItem(gearItem, db, function(){
        db.close()
      })
    })
  }
}

// ----------------------------------------------------------
// Interface Functions - used by Accessible Functions while db
// is defined and connection is live.  Accept a callback() to
// facilitate db.close()
// ----------------------------------------------------------
function insertGearItem(gearItem, db, callback){
  db.collection('gear').insertOne(gearItem,
    function(err,result){
      assert.equal(null,err)
      console.log("Inserted 1 document into the 'gear' collection.")
      callback()
    })
}
