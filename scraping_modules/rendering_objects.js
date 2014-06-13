var dateformat = require('dateformat');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./scraping_modules/config.json'));

function RenderingObject(url, render_name) {
	this.url = url;
	this.render_name = render_name;
}

RenderingObject.prototype.process = function(page) {
	var file_path = this.render_name + dateformat(new Date(), 'yyyy-mm-dd') + '.png';
	page.render(file_path);
	console.log('done saving ' + file_path);
}

var adblock_plus = new RenderingObject(config.adblock_plus.url, config.adblock_plus.render_name);

var webstore_extensions = new RenderingObject(config.webstore_extensions.url, config.webstore_extensions.render_name);

var webstore_adblock = new RenderingObject(config.webstore_adblock.url, config.webstore_adblock.render_name);

var webstore_extensions_adblock = new RenderingObject(config.webstore_extensions_adblock.url, config.webstore_extensions_adblock.render_name);

module.exports = {
	adblock_plus : adblock_plus,
	webstore_extensions : webstore_extensions,
	webstore_adblock : webstore_adblock,
	webstore_extensions_adblock: webstore_extensions_adblock,
};