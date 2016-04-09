var request = require('request'),
 bodyParser = require('body-parser'),
    cheerio = require('cheerio'),
        url = "https://www.rei.com/c/mountain-bikes?r=c&ir=category%3Amountain-bikes&page=1"

request(url, function(err,res,body){
  if(!err){
    // console.log(body)
    var $ = cheerio.load(body)

    $('product-tile').each(function(){
      console.log($(this).text())
    })


  } else {

  }
})
