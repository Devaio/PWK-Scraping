// var str = 'Cannondale\nBad Habit 1 27+ Bike - 2016'
//
// console.log(str.match(/(^.+)\n/)[1])
// console.log(str.match(/\n(.+$)/)[1])

var str = '$1,699.00'

console.log(str.match(/^\$(\d+,\d+)/))
