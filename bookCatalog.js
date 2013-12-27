var catalog = require('./catalog-lib.js').catalog;
var fs = require('fs');
var main = function () {
	var result={};
	var input = catalog.getUserInput(process.argv.slice(2,process.argv.length));
	var parameters = catalog.getParameters(process.argv.slice(2,process.argv.length));
	var option = parameters.option.toString();
	var optionArray = parameters.option;
	var result = catalog.bookCatalog(input,process.argv.slice(2,process.argv.length));
	return result;
};
console.log(main());