var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./scraping_modules/config.json'));
var cheerio = require('cheerio');

function ScrapingObject(url, scrapingCallback) {
	this.url = url;
	this.scrapingCallback = scrapingCallback;
}

ScrapingObject.prototype.process = function(page) {
	var that = this;
	page.evaluate(
		function() {
			return document.body.innerHTML; // returns body html
		}, 
		function(result) {
			var $ = cheerio.load(result); // assigns loaded page to a jquery like script
			that.scrapingCallback($);
		}
	);
}

var google_search = new ScrapingObject(config.google_search.url, function($) {
	var results_list = $('div#ires ol').find('li.g');
	var results_length = results_list.length;
	for(var i = 0; i < results_length; i++) {
		var li = $(results_list[i]);
		var header = li.find('h3.r');
		var result_name = header.text();
		var url_raw = li.find('h3.r a').attr('href');
		var url = url_raw.substring(7);
		url = url.split('&sa=')[0];
		console.log(result_name);
		console.log('-');
		console.log(url);
		console.log('\n');
	}
});

module.exports = {
	google_search : google_search,
}