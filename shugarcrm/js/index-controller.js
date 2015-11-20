//INDEX CONTROLLER

$(document).ready(function() {

	var latestPages;
	var popularPages;
	//Get Last Modified pages
	$.getJSON('http://scarlett.sugarcrm.com/public/api/v1/search?q=*&sort=modified:desc&size=10', function(json, textStatus) {
		latestPages = json;
	});
	//Get Most Popular pages
	$.getJSON('http://scarlett.sugarcrm.com/public/api/v1/search?q=*&sort=rating:desc&size=10', function(json, textStatus) {
		popularPages = json;
	});


}