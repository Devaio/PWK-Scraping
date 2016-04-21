var fs = require('fs')

// Pull the command line arguments
// [2] - file to read gear items from
// --------------------------------------------------------------------
if(process.argv[2]!==undefined){
  var file = process.argv[2]
}else{
  console.log("!-- dbBuild.js requires a file name at command line!")
  console.log("!-- usage: 'node dbBuild.js [fileName]'")
  return
}

// *****************************************************************************
// db connection - initialization / closed on last iteration of dbSave
// *****************************************************************************
var mongoose = require('mongoose'),
        Gear = require('./gear.js'),
       dbURL = 'mongodb://localhost:27017/gears'

mongoose.connect(dbURL,function(err){
  if(!err){
    console.log("-- Connected to gears db.")
  } else {
    console.log("!-- Failed to connect to gears db:")
    console.log(err)
  }
})

// *****************************************************************************
// Behavior Code - read the passed file and call the recursive dbSave
// *****************************************************************************
var gearBox = JSON.parse(fs.readFileSync(__dirname + '/scraped/' + file))
var successCounter = 0,
        errCounter = 0,
        dupCounter = 0,
            dupBox = []
dbSave()
// *****************************************************************************


// Function Definitions
// *****************************************************************************
// dbSave runs recursively against gearBox[]. As long as there are contents in
// gearBox it attempts to write one element at a time to the db.  dbSave checks
// whether the db already contains an item with the same name and refuses to
// save duplicates.
// *****************************************************************************
function dbSave(){
  if(gearBox.length>0){
    var currentGear = gearBox.pop(),
            newGear = new Gear({
                                  type  : currentGear.type,
                                  brand : currentGear.brand,
                                  name  : currentGear.name,
                                  price : currentGear.price,
                                  image : currentGear.image
                                })

    // check whether the db already contains an item with this name
    Gear.findOne({name:newGear.name}, function(err,gear){
      if(!err && gear==null){
        // findOne concludes successfully and finds no duplicate - write the item
        newGear.save(function(err){
          if(!err){
            successCounter++
            dbSave()
          }else{
            errCounter++
            dbSave()
          }
        })
      }else if(!err && gear!==null){
        // findOne concludes successfully but finds a duplicate - refuse duplicate
        dupCounter++
        dupBox.push(newGear.name)
        dbSave()
      }else{
        // findOne returns an error
        errCounter++
        dbSave()
      }
    })
  }else{
    // *************************************************************************
    // db connection - closes on final iteration of dbSave
    // *************************************************************************
    mongoose.connection.close()
    console.log("-- ", successCounter, " gear items added to db successfully." )
    if(errCounter>0) console.log("!- ", errCounter, " gear items failed to add to the db - db error.")
    if(dupCounter>0){
      console.log("!- ", dupCounter, " gear items prevented from saving - duplicate.")
      dupBox.forEach(function(e){
        console.log(e)
      })
    }
    return
  }
}
