//INDEX CONTROLLER

$(document).ready(function() {

	//Get Last Modified pages
	$.getJSON('http://scarlett.sugarcrm.com/public/api/v1/search?q=*&sort=modified:desc&size=10', function(json, textStatus) {
		//TODO add #id
		var list = $("section.content-section > div.row > div:nth-child(3)");
		list.html("");
		list.append("<h2>Latest News & Updates</h2>");
		for (var i = 0; i < 4; i++) {
			var row = json.data[i];
			list.append("<h3><a href='"+row.url+"'>"+row.title+"</a></h3>");
			list.append("<p>"+row.summary+"</p>");
		}


	});
	//Get Most Popular pages
	$.getJSON('http://scarlett.sugarcrm.com/public/api/v1/search?q=*&sort=rating:desc&size=10', function(json, textStatus) {

		//TODO add #id
		var list = $("section.content-section > div.row > div:nth-child(2)");
		list.html("");
		list.append("<h2>Popular Topics</h2>");
		for (var i = 0; i < 4; i++) {
			var row = json.data[i];
			list.append("<h3><a href='"+row.url+"'>"+row.title+"</a></h3>");
			list.append("<p>"+row.summary+"</p>");
		}
	});


});