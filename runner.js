var phantom = require('phantom');
var rendering_objects = require('./scraping_modules/rendering_objects');
var scraping_objects = require('./scraping_modules/scraping_objects');

var run = function(webscraper) {
	phantom.create(function(ph) {
		ph.createPage(function(page) {
			openPage(page, ph, webscraper);
		});
	});
}

console.log(scraping_objects.google_search.url);
run(scraping_objects.google_search);

var openPage = function(page, ph, webscraper) {
	page.open(webscraper.url, function(status) {
		setTimeout(function() {
			webscraper.process(page);
			if(webscraper.callbackObject) {
				openPage(page, ph, webscraper.callbackObject);
			} else {
				ph.exit();
			}
		}, 5000);
	});
};