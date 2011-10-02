var xml2js = require('xml2js'),
    request = require('request');

exports.version = '0.1.0';

exports.getSharingUrl = function(hostname, shareObject, callback) {	
	var hostMetaParser = new xml2js.Parser();
	var oexchangeXrdParser = new xml2js.Parser();
	
	hostMetaParser.on('end', function(result) {
		var link = getLinkByRel(result.Link, 'http://oexchange.org/spec/0.8/rel/resident-target');
		if (! link) {
			callback(false);
			return;
		}	
		request(link.href, function(error, response, body) {
			if (error) {
				callback(false);
				return;
			}
			oexchangeXrdParser.parseString(body);
		});
	});
	hostMetaParser.on('error', function() {
		callback(false);
	});
	
	oexchangeXrdParser.on('end', function(result) {
		var link = getLinkByRel(result.Link, 'http://www.oexchange.org/spec/0.8/rel/offer');
		if (! link) {
			callback(false);
			return;
		}
		var query = '?url=' + encodeURIComponent(shareObject.url);
		if (shareObject['title']) {
			query += '&title=' + encodeURIComponent(shareObject['title'])
		}
		if (shareObject['description']) {
			query += '&description=' + encodeURIComponent(shareObject['description'])
		}
		if (shareObject['tags']) {
			query += '&tags=' + encodeURIComponent(shareObject['tags'])
		}
		if (shareObject['ctype']) {
			query += '&ctype=' + encodeURIComponent(shareObject['ctype'])
		}
		if (shareObject['swfurl']) {
			query += '&swfurl=' + encodeURIComponent(shareObject['swfurl'])
		}
		if (shareObject['iframeurl']) {
			query += '&iframeurl=' + encodeURIComponent(shareObject['iframeurl'])
		}
		if (shareObject['imageurl']) {
			query += '&imageurl=' + encodeURIComponent(shareObject['imageurl'])
		}
		if (shareObject['width']) {
			query += '&width=' + encodeURIComponent(shareObject['width'])
		}
		if (shareObject['height']) {
			query += '&height=' + encodeURIComponent(shareObject['height'])
		}
		if (shareObject['screenshot']) {
			query += '&screenshot=' + encodeURIComponent(shareObject['screenshot'])
		}
		callback(link.href + query);
	});
	oexchangeXrdParser.on('error', function() {
		callback(false);
	});
	
	var url = 'http://' + hostname + '/.well-known/host-meta'
	request(url, function(error, response, body) {
		if (error) {
			callback(false);
			return;
		}
	    hostMetaParser.parseString(body);
	});
};

var getLinkByRel = function(links, rel) {
	if (! links) {
		return false;
	}
	if (typeof(links['@']) === 'object') {
  		if (links['@'].rel === rel) {
			return links['@'];
		}
		return false;
	}
	for (var i = 0; i < links.length; i++) {
		if(links[i]['@'].rel === rel) {
			return links[i]['@'];
		}
	}
	return false;
};