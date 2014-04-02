module.exports = function(swig) {
	swig.setFilter('datefromunix', function (input) {
	  return new Date(input/1000);
	});
};