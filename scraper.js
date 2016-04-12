var casper = require('casper').create({
                                        pageSettings: {
                                          userAgent : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0 Gecko/20130404 Firefox/23.0)'
                                        }
                                      }),
 scrapeURL = 'https://www.rei.com/c/cargo-boxes-baskets-and-bags?r=c&ir=category%3Acargo-boxes-baskets-and-bags&page=1'

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

// *************************************************************************
// processPage is responsible for iterating over all available results pages,
// on which it calls getGear
// *************************************************************************
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
    var brandEx = new RegExp(/(^.+)\n/)
    if(e.querySelector('.brand-name')!==null){
      if(brandEx.test(e.querySelector('.brand-name').innerText)){
        item.brand = e.querySelector('.brand-name').innerText.match(/(^.+)\n/)[1]
      }else{
        item.brand = e.querySelector('.brand-name').innerText
      }
    }else if (e.querySelector('.product-title a')!==null){
      if(brandEx.test(e.querySelector('.product-title a').innerText)){
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
    var nameEx = new RegExp(/\n(.+$)/)
    if(e.querySelector('.clean-title')!==null){
      item.name = e.querySelector('.clean-title').innerText
    }else if (e.querySelector('.product-title a')!==null){
      if(nameEx.test(e.querySelector('.product-title a').innerText)){
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
    var priceEx = new RegExp(/^\$(\d+,?\d*)/)
    if(e.querySelector('.price')!==null){
      if(priceEx.test(e.querySelector('.price').innerText)){
        item.price = e.querySelector('.price').innerText.match(/^\$(\d+,?\d*)/)[1]
      }else{
        item.price = e.querySelector('.price').innerText
      }
    }else if(e.querySelector('.sale-price')!==null){
      if(priceEx.test(e.querySelector('.sale-price').innerText)){
        item.price = e.querySelector('.sale-price').innerText.match(/^\$(\d+,?\d*)/)[1]
      }else{
        item.price = e.querySelector('.sale-price').innerText
      }
    }else{
      item.price = "no scrape."
    }

    // eliminate the comma!
    if(item.price.includes(',')){
      item.price = parseInt(item.price.replace(/,/g,""))
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

// *************************************************************************
// simple Stringify for the item objects we're returning
// *************************************************************************
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
