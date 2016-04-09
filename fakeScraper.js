var interfaceDB = require('./interfaceDB.js')

var tent = new Gear('Kelty SuperFly','tent',225.00)
interfaceDB.addGear(tent)
interfaceDB.viewGear('Kelty SuperFly')
function Gear(name,type,price){
  this.name  = name
  this.type  = type
  this.price = price
}
