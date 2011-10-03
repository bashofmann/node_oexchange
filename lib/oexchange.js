var xml2js = require('xml2js'),
    request = require('request');

exports.version = '0.1.1';

exports.getSharingUrl = function(hostname, shareObject, callback) {	

	getOExchangeXrd(hostname, function(xrd) {
		if (! xrd) {
			callback(false);
		}
		var link = getElementAttributesByRel(xrd, 'Link', 'http://www.oexchange.org/spec/0.8/rel/offer');
		if (! link) {
			callback(false);
			return;
		}
		callback(createSharingUrl(link.href, shareObject));
	});

};

exports.getSharingObject = function(hostname, shareObject, callback) {	
	getOExchangeXrd(hostname, function(xrd) {
		if (! xrd) {
			callback(false);
		}
		var link = getElementAttributesByRel(xrd, 'Link', 'http://www.oexchange.org/spec/0.8/rel/offer');
		if (! link) {
			callback(false);
			return;
		}
		var sharingObject = {
			'sharingUrl': createSharingUrl(link.href, shareObject)
		};
		
		sharingObject['icon'] = getElementAttributesByRel(xrd, 'Link', 'icon');
		sharingObject['icon32'] = getElementAttributesByRel(xrd, 'Link', 'icon32');
		sharingObject['vendor'] = getElementByType(xrd, 'Property', 'http://www.oexchange.org/spec/0.8/prop/vendor');
		sharingObject['title'] = getElementByType(xrd, 'Property', 'http://www.oexchange.org/spec/0.8/prop/title');
		sharingObject['name'] = getElementByType(xrd, 'Property', 'http://www.oexchange.org/spec/0.8/prop/name');		
		sharingObject['prompt'] = getElementByType(xrd, 'Property', 'http://www.oexchange.org/spec/0.8/prop/prompt');

		callback(sharingObject);
	});
};

var createSharingUrl = function(endpoint, shareObject) {
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
	return endpoint + query;
};

var getOExchangeXrd = function(hostname, callback) {
	var hostMetaParser = new xml2js.Parser();
	var oexchangeXrdParser = new xml2js.Parser();
	
	hostMetaParser.on('end', function(result) {
		var link = getElementAttributesByRel(result, 'Link', 'http://oexchange.org/spec/0.8/rel/resident-target');
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
	
	oexchangeXrdParser.on('end', callback);
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

var getElement = function(xrd, elementName, queryScope, queryField, query, returnScope) {
	if (! xrd || ! xrd[elementName]) {
		return false;
	}
	if (typeof(xrd[elementName][queryScope]) === 'object') {
  		if (xrd[elementName][queryScope][queryField] === query) {
			return xrd[elementName][returnScope];
		}
		return false;
	}
	for (var i = 0; i < xrd[elementName].length; i++) {
		if(xrd[elementName][i][queryScope][queryField] === query) {
			return xrd[elementName][i][returnScope];
		}
	}
	return false;
}

var getElementByType = function(xrd, elementName, type) {
	return getElement(xrd, elementName, '@', 'type', type, '#');
};

var getElementAttributesByRel = function(xrd, elementName, rel) {
	return getElement(xrd, elementName, '@', 'rel', rel, '@');	
};