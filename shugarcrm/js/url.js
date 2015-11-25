var BASE_URL = "http://scarlett.sugarcrm.com/Sugar/shugarcrm/";

$(document).ready(function () {

	//LOGIN BUTTON
	$("#navbar a.btn").attr("href","https://www.sugarcrm.com/sso?redirect="+window.location.href);

	//Change SEARCH FORM ACTION - HEADER
	$("section.filters form").change(function() {
	  var action = $(this).val();
	});
	$("section.filters form").attr("action", "/search/");

	//Select ULTIMATE RIGHT AWAY - HEADER
	// $("#searchForm select[name='tag1']").selectpicker('val', 'Ultimate');

	var url = window.location.href.replace("http://", "").replace("https://", "");
	var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");

	//Remove BreadCrumbs from level 1 pages
	if(path.split("/").length == 1 || path.indexOf("search") == 0)
		$("section.content-heading").html("");

	//Hide comment classes
	$("section.content-body .comment").hide();

	if(path.indexOf("Documentation") > -1){
		//Documentation PAGES
		loadScript(BASE_URL+"js/sugar-versions-controller.js");
	}else if(path.indexOf("Get_Started") > -1){
		//GETTING STARTED
		loadScript(BASE_URL+"js/get_started-controller.js");
	}else if(path.indexOf("Resources") == 0){
		//RESOURCES
		$(".content-navbar-toogle").hide();
	}else if(path.indexOf("search") > -1){
		//SEARCH
		$(".content-navbar-toogle").hide();
	}else if(path.indexOf("/") == -1){
		//INDEX PAGE 
		loadScript(BASE_URL+"js/index-controller.js");
		$(".content-navbar-toogle").hide();
	}
});

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

