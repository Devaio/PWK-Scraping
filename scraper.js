var casper = require('casper').create({
                                        pageSettings: {
                                          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0 Gecko/20130404 Firefox/23.0)'
                                        }
                                      }),
 scrapeURL = 'https://www.rei.com/c/climbing-hardware?r=c&ir=category%3Aclimbing-hardware&page=1'

var gear = []
console.log("Starting scrape at: ", scrapeURL)
casper.start(scrapeURL,
              function(){
                console.log("- Completed initial load - waiting for appearance of '.product-tile'.")
              })
casper.waitForSelector('.product-tile', processPage)
casper.then(
              function(){
                gear.forEach(function(e,i){
                  logGear(e,i)
                })
              })
casper.run()

function processPage(){
  var newGear = this.evaluate(getGear)
  gear = gear.concat(newGear)

  if(this.exists('#next-page.inactive')){
    // Last page reached - terminate()
    console.log("- Last results page scraped. gear[].length: ", gear.length)
    return
  }else{
    // Not yet at last page - recur processPage()
    console.log("- Proceeding to next page.  gear[].length: ", gear.length)
    this.thenClick('#pagination a[title="Next page"]')
        .then(function(){
          this.waitForSelector('.product-tile', processPage)
        })
  }
}

// *************************************************************************
// getGear does the actual scraping by interpreting results from the iterated
// '.product-tile'.  It tries a sequence of different options - REI.com is
// not perfectly consistent on formatting the children of '.product-tile'
// *************************************************************************
function getGear(){
  var gear = document.querySelectorAll('.product-tile')
  return Array.prototype.map.call(gear,function(e){
    var item = {}

    // *************************************************************************
    // 1. direct selector - '.brand-name' / '.clean-title' / etc.
    // 2. parsing brand and name from a combined field '.product-title'
    // 3. gives up and writes 'no scrape'
    // *************************************************************************

    // -------------------------------------------------------------------------
    // set the value of brand
    // -------------------------------------------------------------------------
    if(e.querySelector('.brand-name')!==null){
      if(e.querySelector('.brand-name').innerText.match(/(^.+)\n/).length>1){
        item.brand = e.querySelector('.brand-name').innerText.match(/(^.+)\n/)[1]
      }else{
        item.brand = e.querySelector('.brand-name').innerText
      }
    }else if (e.querySelector('.product-title a')!==null){
      if(e.querySelector('.product-title a').innerText.match(/(^.+)\n/).length>1){
        item.brand = e.querySelector('.product-title a').innerText.match(/(^.+)\n/)[1]
      }else{
        item.brand = e.querySelector('.product-title a').innerText
      }
    }else{
      item.brand = "no scrape."
    }

    // -------------------------------------------------------------------------
    // set the value of name
    // -------------------------------------------------------------------------
    if(e.querySelector('.clean-title')!==null){
      item.name = e.querySelector('.clean-title').innerText
    }else if (e.querySelector('.product-title a')!==null){
      if(e.querySelector('.product-title a').innerText.match(/\n(.+$)/).length>1){
        item.name = e.querySelector('.product-title a').innerText.match(/\n(.+$)/)[1]
      }else{
        item.name = e.querySelector('.product-title a').innerText
      }
    }else{
      item.name = "no scrape."
    }

    // -------------------------------------------------------------------------
    // set the value of price
    // -------------------------------------------------------------------------
    if(e.querySelector('.price')!==null){
      if(e.querySelector('.price').innerText.match(/^\$(\d+,?\d+)/).length>1){
        item.price = e.querySelector('.price').innerText.match(/^\$(\d+,?\d+)/)[1]
      }else{
        item.price = e.querySelector('.price').innerText
      }
    }else{
      item.price = "no scrape."
    }

    // -------------------------------------------------------------------------
    // set the value of image
    // -------------------------------------------------------------------------
    if(e.querySelector('.result-image')!==null){
      item.image = "http://www.rei.com" + e.querySelector('.result-image').getAttribute('src')
    }else{
      item.image = "no scrape."
    }
    return item
  })
}

function logGear(e,i){
  if(e!==null){
    console.log("\n---- Product ", i, " ----")
    console.log("brand : ", e.brand)
    console.log("name  : ", e.name)
    console.log("price : ", e.price)
    console.log("image : ", e.image)
  }else{
    return
  }
}
