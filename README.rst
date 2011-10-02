==============
node_oexchange
==============

A module for handling OExchange host discovery (see http://www.oexchange.org/).

Installation
------------

 npm install oexchange
 
Usage
-----

First you have to require the oexchange package:

  var oexchange = require('oexchange');
  
node_oexchange exposes a method called "getSharingUrl" which can be used to get a valid sharing URL based on a given hostname and sharing object. The sharing object can contain all fiels that are specified in the OExchange specification (see http://www.oexchange.org/spec/#offer-parameters)

 var sharingObject = {
     'url': 'http://www.example.com/foo',
     'title': 'Example site'
 };    
 oexchange.getSharingUrl('www.researchgate.net', sharingObject, function(result) {
	 console.log(result); // either the sharing url or "false"
 });