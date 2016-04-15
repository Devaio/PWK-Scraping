#PWK-Scraping

PWK-Scraping is a portion of a larger demonstration for a MEAN-stack
application - White Kodiak - viewable at https://github.com/hdub2/Project-White-Kodiak.

scraper.js is built using the PhantomJS headless browser with CasperJS for
navigation scripting and automation.  It is specifically set up to scrape REI's
gear catalog.  The scraped content is output to JSON files.

dbBuild.js consumes the JSON output of scraper.js and uses it to populate a
mongoDB.  It will prevent the addition of duplicate items, as the gear database
for this project is intended to contain unique items.
