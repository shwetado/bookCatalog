var fs = {};
fs.readFileSync = function(filename,method){
	return fs.data1;
};
fs.writeFileSync = function(filename,data){
	return fs.data.length;
};
fs.appendFileSync = function(filename,data){
	return fs.data.length;
};
exports.fs = fs;