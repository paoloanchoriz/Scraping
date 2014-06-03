var cheerio = require('cheerio');
var request = require('request');

var url = 'https://www.google.com/search?q=';
var q_string = 'adblock';

var results_query = 'li.g';
var el_query = {
	title: function(html) {
		return html.find('h3.r a').text();
	},
	link: function(html) {
		var href = html.find('h3.r a').attr('href');
		href = href.substring(7);
		href = href.split('&sa=')[0];
		return href;
	},
};

var result_summary = [];

var createRequest = function(http_request) {
	request(http_request, function(err, resp, body) {
		if(err) {
			createRequest(http_request);
			return;
		}
		var $ = cheerio.load(body);
		var results = $('li.g');
		results.each(function(){
			var single_result = {};
			for(attr in el_query) {
				single_result[attr] = el_query[attr]($(this));
			}
			result_summary.push(single_result);
			// console.log($(this).html());
			// console.log('\n');
			// console.log($(this).find(el_query.title).text());
			// console.log('\n');//.find(el_query.title).text());
			// console.log($(this).find(el_query.link).attr('href'));
			// console.log('\n');
		});
		console.log(result_summary);
	});
}

createRequest(url + q_string);