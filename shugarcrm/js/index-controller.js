//INDEX CONTROLLER

$(document).ready(function() {

	var latestPages;
	//Get Last Modified pages
	$.getJSON('http://scarlett.sugarcrm.com/public/api/v1/search?q=*&sort=modified:desc&size=10', function(json, textStatus) {
		latestPages = json;
	});

}