var casper = require('casper').create({
                                        pageSettings: {
                                          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0 Gecko/20130404 Firefox/23.0)'
                                        }
                                      }),
 scrapeURL = 'https://www.rei.com/c/mountain-bikes?r=c&ir=category%3Amountain-bikes&page=1'

var gear = []
console.log("Starting scrape at: ", scrapeURL)
casper.start(scrapeURL,
              function(){
                console.log("- Completed initial load - waiting for appearance of '.product-tile'.")
              })
casper.waitForSelector('.product-tile',
              function(){
                console.log("- '.product-tile' appeared.")
              })
casper.then(
              function(){
                gear = this.evaluate(getGear)
              })
casper.then(
              function(){
                gear.forEach(function(e){
                  console.log(e)
                })
              })
casper.run()


function getGear(){
  var gear = document.querySelectorAll('.product-tile')
  return Array.prototype.map.call(gear,function(e){
    return e.querySelector('.product-title a').innerText.match(/(^.+)<br>/)
  })
}
