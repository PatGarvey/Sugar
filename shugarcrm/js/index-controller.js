//INDEX CONTROLLER

$(document).ready(function() {

	// jQuery.getFeed({
	//    url: 'rss.xml',
	//    success: function(feed) {
	//      alert(feed.title);
	//    }
	//  });


	$.ajax({
		type: "GET",
		crossDomain: true,
		// headers: { 'Access-Control-Allow-Origin': '*' },
		url: "https://community.sugarcrm.com/view-browse-feed.jspa?filterID=all~objecttype~objecttype%5Bblogpost%5D&browseSite=content&userIDs=-1&browseViewID=content",
		dataType: "text",
		success: function(xml) {
			//TODO add #id
			var list = $("section.content-section > div.row > div:nth-child(1)");
			list.html("");
			list.append("<h2>Latest News</h2>");
			for (var i = 0; i < 4; i++) {
				var row = xml.channel[i];
				list.append("<h3><a href='" + row.url + "'>" + row.title + "</a></h3>");
				list.append("<p>" + row.summary + "</p>");
			}
		},
		error: function(error) {
			console.log("error " + error);
		}
	});

	//Get Last Modified pages
	$.getJSON('http://scarlett.sugarcrm.com/sugar/rest/v10/documentation/search?q=*&sort=modified:desc&size=10', function(json, textStatus) {
		//TODO add #id
		var list = $("section.content-section > div.row > div:nth-child(3)");
		list.html("");
		list.append("<h2>Content Updates</h2>");
		for (var i = 0; i < 4; i++) {
			var row = json.data[i];
			list.append("<h3><a href='" + row.url + "'>" + row.title + "</a></h3>");
			list.append("<p>" + row.summary + "</p>");
		}
	});

	//Get Most Popular pages
	$.getJSON('http://scarlett.sugarcrm.com/sugar/rest/v10/documentation/search?q=*&sort=rating:desc&size=10', function(json, textStatus) {

		//TODO add #id
		var list = $("section.content-section > div.row > div:nth-child(2)");
		list.html("");
		list.append("<h2>Popular Topics</h2>");
		for (var i = 0; i < 4; i++) {
			var row = json.data[i];
			list.append("<h3><a href='" + row.url + "'>" + row.title + "</a></h3>");
			list.append("<p>" + row.summary + "</p>");
		}
	});


});