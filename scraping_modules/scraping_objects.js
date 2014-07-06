var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));
var cheerio = require('cheerio');
var csvDownloader = require('../utility/utility').csvDownloader;
var googleSearchScraper = require('../utility/utility').googleSearchScraper;

function ScrapingObject(url, scrapingCallback, path_name) {
	this.url = url;
	this.scrapingCallback = scrapingCallback;
	this.path_name = path_name;
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

var google_search = new ScrapingObject(config.google_search.url, googleSearchScraper, config.google_search.path_name);

var adblock_plus_csv = new ScrapingObject(config.adblock_plus_csv.url, csvDownloader, config.adblock_plus_csv.path_name);

var os_csv = new ScrapingObject(config.os_csv.url, csvDownloader, config.os_csv.path_name);

var google_search_pagetwo = new ScrapingObject(config.google_search_pagetwo.url, googleSearchScraper, config.google_search_pagetwo.path_name);

module.exports = {
	google_search : google_search,
	google_search_pagetwo : google_search_pagetwo,
	adblock_plus_csv : adblock_plus_csv,
	os_csv : os_csv
}