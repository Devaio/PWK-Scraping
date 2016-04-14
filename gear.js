var mongoose = require('mongoose'),
      Schema = require('mongoose').Schema,

gearSchema = new Schema({
  type   : {type:String, required:true},  // Item category, i.e. backpack, climbing harness
  name   : {type:String, required:true},  // Individual item name, i.e. Cato, Tarantulace
  brand  : {type:String, required:true},  // Manufacturer, i.e. Black Diamond, Kelty
  price  : {type:Number, required:true},
  image  : {type:String, required:true}
})

module.exports = mongoose.model('Gear',gearSchema)
