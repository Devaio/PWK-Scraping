var casper = require('casper').create({
                                        pageSettings: {
                                          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0 Gecko/20130404 Firefox/23.0)'
                                        },
                                        clientScripts: [
                                          './bower_components/jquery/jquery.js'
                                        ]
                                      }),
 scrapeURL = 'https://www.rei.com/c/climbing-hardware?r=c&ir=category%3Aclimbing-hardware&page=8'

var gear = []

casper.start(scrapeURL,
              function(){
                console.log("- Completed initial load - waiting for appearance of '.product-tile'.")
              })
casper.waitForSelector('.product-tile', processPage)
casper.run()

function processPage(){
  console.log("- '.product-tile' appeared.")
  // gear = gear.concat(this.evaluate(getGear))

  if(this.evaluate(function(){
    return $('#next-page').hasClass('inactive')
  })){
    console.log("Next-Page Inactive")
  }else{
    console.log("Next-Page Active")
  }
  // this.thenClick('#pagination a[title="Next page"]')
  //     .then(function(){
  //       this.waitForSelector('.product-tile', processPage)
  //     })
}
