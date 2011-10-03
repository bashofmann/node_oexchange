==============
node_oexchange
==============

A module for handling OExchange host discovery (see http://www.oexchange.org/).

Installation
------------

::

 npm install oexchange
 
Usage
-----

First you have to require the oexchange package

::

  var oexchange = require('oexchange');
  
node_oexchange exposes two methods:

"getSharingUrl" which can be used to get a valid sharing URL based on a given hostname and sharing object. The sharing object can contain all fiels that are specified in the OExchange specification (see http://www.oexchange.org/spec/#offer-parameters)

::

 var sharingObject = {
     'url': 'http://www.example.com/foo',
     'title': 'Example site'
 };    
 oexchange.getSharingUrl('www.researchgate.net', sharingObject, function(result) {
	 console.log(result); // either the sharing url or "false"
 });
 
and "getSharingObject" wich not only returns the sharing URL but also all other information that is specified in the OExchange XRD (see http://www.oexchange.org/spec/#discovery-targetxrd), so that you can build a linked sharing button for example

::

 var sharingObject = {
    'url': 'http://www.example.com/foo',
    'title': 'Example site'
 };    
 oexchange.getSharingObject('www.researchgate.net', sharingObject, function(result) {
	 console.log(result); // either the sharing object url or "false"
	 // to render a the result sharing object you should use a templating language, e.g. Mustache.js (see https://github.com/janl/mustache.js/)
	 var template = '<a href="{{sharingUrl}}"><img src="{{icon32}}" /></a>';
	 var html = Mustache.to_html(template, sharingObject);
 });