var fs = require('fs'),
  Gear = require(__dirname + '/gear.js').Gear

if(process.argv[2]!==undefined){
  var file = process.argv[2]
}else{
  console.log("!-- dbBuild.js requires a file name at command line!")
  console.log("!-- usage: 'node dbBuild.js [fileName]'")
  return
}

var gearBox = JSON.parse(fs.readFileSync(__dirname + '/scraped/' + file))
dbSave()

// ***************************************************************************** ****
//
// ***************************************************************************** ****
function dbSave(){
  console.log(gearBox.pop())
}

// ***************************************************************************** ****
// simple Stringify for the item objects we're returning
// !! used for build & debug - deprecated in final version - replaced by dbWrite !!!!
// ***************************************************************************** ****
function logGear(gear){
  if(gear!==null){
    console.log("\n---- Product ", i, " ----")
    console.log("type  : ", gear.type)
    console.log("brand : ", gear.brand)
    console.log("name  : ", gear.name)
    console.log("price : ", gear.price)
    console.log("image : ", gear.image)
  }else{
    return
  }
}
