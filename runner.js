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

var openPage = function(page, ph, webscraper) {
	page.open(webscraper.url, function(status) {
		setTimeout(function() {
			webscraper.process(page);
			ph.exit();
		}, 60000);
	});
};

var run_command = process.argv[2];

var webscraper = rendering_objects[run_command] || scraping_objects[run_command];

if(webscraper)
	run(webscraper);
else {
	console.log('\n\nNo such command, please input any of the following:\n');
	console.log('\t-google_search\n\t-google_search_pagetwo\n\t-adblock_plus_csv\n\t-os_csv' +
		'\n\t-adblock_plus\n\t-webstore_extensions\n\t-webstore_adblock\n\t-webstore_extensions_adblock\n\n');
}

