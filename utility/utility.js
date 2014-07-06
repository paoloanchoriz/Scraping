var url = require('url');
var fs = require('fs');
var https = require('https');
var xlsx = require('xlsx');
var dateformat = require('dateformat');

// Will be used to name sheets for google results
var sheet_name = 'google_results';
//function that will download csv using the anchor href from the mozilla website
//accepts cheerio object for scraping
var csvDownloader = function($) {
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

var addCell = function(result_pair, row_count, col_count, worksheet) {
	var cell = { v: result_pair, t: 's' };
	var cell_ref = xlsx.utils.encode_cell({ c: col_count, r: row_count });
	worksheet[cell_ref] = cell;
};

var readWorkBook = function(workbook, content) {
	workbook.Sheets['google_results'];
	var sheet = workbook.Sheets[sheet_name];
	var cell = {};
	for(var key in sheet) {
		var col = key[0];
		if(key[0] === '!') continue;
		if(col === 'A') { 
			cell.name = sheet[key].v;
		} else if(col === 'B') { 
			cell.url = sheet[key].v;
			content.push(cell);
			cell = {};
		}
	}
};

var writeWorkBook = function(workbook, content, file_name) {
	var worksheet = {};
	var content_length = content.length;
	var i;
	for(i = 0; i < content_length; i++) {
		var result = content[i];
		addCell(result.name, i, 0, worksheet);
		addCell(result.url, i, 1, worksheet);
	}
	worksheet['!ref'] = xlsx.utils.encode_range({ s: { c: 0, r: 0 }, e: { c:1, r: i }});
	workbook.SheetNames.push(sheet_name);
	workbook.Sheets[sheet_name] = worksheet;
	xlsx.writeFile(workbook, file_name);
};

var addToFile = function(results_arr, file_name) {
	var workbook = { Sheets: {}, SheetNames: []};
	try{
		var workbook = xlsx.readFile(file_name);
	} catch (e) {
		console.log('Workbook does not exist. Will create later');
	}
	var content = [];
	if(workbook.SheetNames.length) readWorkBook(workbook, content);
	content = content.concat(results_arr);
	writeWorkBook(workbook, content, file_name);
};

var googleSearchScraper = function($) {
	var results_list = $('div#ires ol').find('li.g');
	var results_length = results_list.length;
	var results_arr = [];
	for(var i = 0; i < results_length; i++) {
		var li = $(results_list[i]);
		var header = li.find('h3.r');
		var result_name = header.text();
		var url_raw = li.find('h3.r a').attr('href');
		var url = url_raw.substring(7);
		url = url.split('&sa=')[0];
		results_arr.push({ url: url, name: result_name});
	}
	addToFile(results_arr, this.path_name + '/results_' + dateformat(new Date(), 'yyyy-mm-dd') + '.xlsx');
};

module.exports.csvDownloader = csvDownloader;
module.exports.googleSearchScraper = googleSearchScraper;