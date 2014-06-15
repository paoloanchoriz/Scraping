var url = require('url');
var fs = require('fs');
var https = require('https');

//function that will download csv using the anchor href from the mozilla website
//accepts cheerio object for scraping
var csv_downloader = function($) {
	//get the link href
	var href = $('a#export_data_csv').attr('href');
	var raw_url = url.parse(this.url);
	//add protocol and host to href request
	var request_url = raw_url.protocol + '//' + raw_url.host + href;

	//get the path and split using backslash
	var path_array = url.parse(request_url).pathname.split('/');
	//get the last part to use as filename
	var file_name_index = path_array.length - 1;
	var file_name = path_array[file_name_index];

	//open a file to write on
	var file = fs.createWriteStream(this.path_name + '/' + file_name);

	//proceed with download and write
	https.get(request_url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			file.close();
		});
	});
};

var google_search_scraper = function($) {
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
};

module.exports.csv_downloader = csv_downloader;
module.exports.google_search_scraper = google_search_scraper;